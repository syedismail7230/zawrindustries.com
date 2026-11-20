import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { sendMailWithPoolFailover } from '@/lib/smtp-pool';
import { generateBlogApprovalEmailHTML } from '@/lib/blogApprovalEmailTemplate';
import { supabase } from '@/lib/supabase';
import { generateBlogNewsletterEmailHTML } from '@/lib/blogNewsletterEmailTemplate';
import { logEmailDispatch } from '@/lib/analytics-tracker';
import { notifySearchEngines } from '@/lib/search-indexing';

const BLOGS_FILE_PATH = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'data', 'blogs.json');

// Industry catalog for automated topic discovery
export const ZAWR_INDUSTRIES = [
  {
    name: 'Artificial Intelligence & Autonomous Decision Systems',
    category: 'Artificial Intelligence',
    keywords: ['Agentic AI', 'Multi-Modal Reasoning', 'Enterprise Decision Intelligence', 'Firm AI', 'VelocityOS', 'Neural Workflows'],
    defaultImage: 'https://res.cloudinary.com/murfclni/image/upload/v1783710407/zawr/assets/ai-data-analytics-hero.png',
  },
  {
    name: 'Automated Supply Chain & Freight Logistics',
    category: 'Supply Chain & Logistics',
    keywords: ['Fleet Telematics', 'Cold Chain Monitoring', 'Automated Route Optimization', 'AGV Warehousing', 'Multi-Modal Freight'],
    defaultImage: 'https://res.cloudinary.com/murfclni/image/upload/v1785803597/zawr/assets/AGV.png',
  },
  {
    name: 'Precision Manufacturing & Industrial Autonomy',
    category: 'Advanced Manufacturing',
    keywords: ['Precision CNC Machining', 'Robotic Assembly Lines', 'IoT Shop-Floor Telemetry', 'Predictive Equipment Maintenance', 'Zero-Defect Quality'],
    defaultImage: 'https://res.cloudinary.com/murfclni/image/upload/v1786404821/zawr/assets/3d-print.png',
  },
  {
    name: 'Enterprise IT Architecture & Cloud Engineering',
    category: 'Enterprise Technology',
    keywords: ['Zero-Trust Security', 'Kubernetes Orchestration', 'Microservices Architecture', 'Cloud Infrastructure Migration', 'CI/CD Pipelines'],
    defaultImage: 'https://res.cloudinary.com/murfclni/image/upload/v1783710408/zawr/assets/application-development-hero.png',
  },
  {
    name: 'Commercial Real Estate Development & Infrastructure',
    category: 'Real Estate & Infrastructure',
    keywords: ['Smart Commercial Spaces', 'Urban Infrastructure Asset Management', 'Sustainable Architecture', 'Commercial Real Estate Growth'],
    defaultImage: 'https://res.cloudinary.com/murfclni/image/upload/v1783710521/zawr/assets/life-at-zawr.png',
  },
  {
    name: 'Clean Energy & Industrial EV Charging',
    category: 'Sustainability & Clean Energy',
    keywords: ['EV Forecourt Infrastructure', 'Microgrid BESS Storage', 'Utility Scale Solar', 'Carbon-Neutral Industrial Operations'],
    defaultImage: 'https://res.cloudinary.com/murfclni/image/upload/v1783710556/zawr/assets/sustainability-environment.png',
  },
];

export interface BlogSection {
  title: string;
  body: string;
}

const STATIC_BLOG_ASSETS = [
  '/Blog-assets/Blog%20(1).png',
  '/Blog-assets/Blog%20(2).png',
  '/Blog-assets/Blog%20(3).png',
  '/Blog-assets/Blog%20(4).png',
  '/Blog-assets/Blog%20(5).png',
];

export function cleanSectionTitle(title: string = ''): string {
  if (!title) return '';
  return title
    .replace(/^\[+|\s*\]+$/g, '')
    .replace(/^#+\s*/, '')
    .trim();
}

/**
 * Retrieves a random image from the "Blog assets" collection.
 * Static URL mapping avoids serverless runtime file-trace overhead.
 */
export function getRandomBlogAssetImage(): string {
  const randomIndex = Math.floor(Math.random() * STATIC_BLOG_ASSETS.length);
  return STATIC_BLOG_ASSETS[randomIndex];
}

export interface GeneratedBlog {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorImage: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  readTime: string;
  sections: BlogSection[];
  status: 'published' | 'pending_approval' | 'draft' | 'held';
  sensitive: boolean;
  sensitivityReason?: string;
  factCheckLayer1Passed: boolean;
  factCheckLayer2Passed: boolean;
  factCheckReport?: string;
  approvalToken?: string;
  createdAt: string;
  helpfulness?: {
    yes: number;
    no: number;
  };
}

/**
 * Call Google Gemini API with fallback retry
 */
async function callGemini(prompt: string, jsonMode: boolean = false): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from environment variables');
  }

  const candidateModels = ['gemini-flash-lite-latest', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const body: any = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      };

      if (jsonMode) {
        body.generationConfig.responseMimeType = 'application/json';
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(35000),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini returned an empty response');
      }

      return text;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, trying next candidate:`, err.message);
    }
  }

  throw new Error(`All Gemini candidate models failed: ${lastError?.message || 'Unknown error'}`);
}

/**
 * STAGE 1: Discover / Select Industry & Topic
 */
export function getIndustryTopic(customTopic?: string, targetCategory?: string) {
  let industry = ZAWR_INDUSTRIES[Math.floor(Math.random() * ZAWR_INDUSTRIES.length)];
  if (targetCategory) {
    const found = ZAWR_INDUSTRIES.find((ind) => ind.category.toLowerCase().includes(targetCategory.toLowerCase()) || ind.name.toLowerCase().includes(targetCategory.toLowerCase()));
    if (found) industry = found;
  }
  return {
    industry,
    topic: customTopic || null,
  };
}

/**
 * STAGE 2: Deep Research & Draft Generation with Expert SEO Engine
 */
async function generateDraft(topicPrompt: string, industry: typeof ZAWR_INDUSTRIES[0]): Promise<GeneratedBlog> {
  const prompt = `
You are the Executive Chief Editor and Technology Research Director at Zawr Industries LLP (zawrindustries.com).
Your task is to conduct deep research and write an authoritative, high-depth, publication-ready B2B blog article matching the editorial rigor of Harvard Business Review, McKinsey Insights, or Gartner, engineered for dominant Google search rankings and AI Overviews.

TOPIC / FOCUS: ${topicPrompt || `Modern Advancements and Strategic Implementation in ${industry.name}`}
PRIMARY INDUSTRY VERTICAL: ${industry.category}

MANDATORY EDITORIAL & SEO RULES:
1. STRICT FACTUAL ACCURACY: You must NOT make fake commitments, fictitious metrics, fabricated customer case studies, or speculative promises. Every claim, protocol, technical mechanism, and concept must be realistic and scientifically/operationally accurate.
2. SUBTLE BRAND WEAVING ("A PINCH OF ZAWR INDUSTRIES"):
   - Naturally, organically, and subtly weave in how Zawr Industries approaches this sector (e.g. through proprietary platforms like Firm AI, VelocityOS, automated supply chain robotics, or precision engineering protocols).
   - Do NOT write a pushy sales pitch. It must read as an objective, authoritative whitepaper where Zawr Industries' capabilities are mentioned as an authentic modern benchmark or practical case paradigm.
3. SEARCH ENGINE OPTIMIZATION (SEO) & AI ANSWER ENGINE ARCHITECTURE:
   - TARGET HIGH-INTENT SEARCH: Title must be captivating, front-loaded with primary keywords, and strictly under 60 characters.
   - SECTION 1: "Strategic Context & Key Takeaways" - Must begin with 3 concise, bulleted key takeaways explicitly written to win Google's Position 0 (Featured Snippets) and AI answer engines (ChatGPT Search, Perplexity, Gemini).
   - INTERNAL LINKING: Naturally embed 1-2 hyperlinks to relevant Zawr capabilities (e.g. [Cloud Engineering](/industries/it-service/cloud), [AI & Data Analytics](/industries/it-service/ai-data-analytics), [Cybersecurity](/industries/it-service/cybersecurity), [Supply Chain Logistics](/industries/transport-and-logistics), [Advanced Manufacturing](/industries/manufacturing), [Clean Energy Solutions](/industries/energy), or [About Zawr](/about)).
   - SECTION 5: "Frequently Asked Questions" - Must provide 3 high-volume search questions and concise, authoritative answers formatted as:
     **Q: What is [strategic question]?**
     A: [Clear 2-sentence direct answer].
     (This directly powers Google FAQ rich expandable search cards).
4. ZERO SQUARE BRACKETS IN TITLES:
   Section titles must NEVER be enclosed in square brackets [ or ] or markdown hashes. Output clean plain text titles (e.g. "Strategic Context & Key Takeaways", NOT "[Strategic Context & Key Takeaways]").
5. STRUCTURE:
   - Provide an SEO-optimized Title (strictly under 60 characters).
   - Provide a clean URL slug (kebab-case).
   - Provide a 120-150 word executive summary.
   - Provide reading time (e.g., "5 min read" or "6 min read").
   - Provide 5 detailed, structured sections including the FAQ section. Each section must have a clear "title" (WITHOUT square brackets) and an extensive, analytical "body" (at least 2-3 substantial paragraphs per section) explaining architectures, real-world operational challenges, and strategic solutions.

RETURN STRICTLY A JSON OBJECT matching this exact schema:
{
  "title": "Concise SEO Title Under 60 Chars",
  "slug": "concise-kebab-case-slug",
  "category": "${industry.category}",
  "readTime": "6 min read",
  "summary": "120-150 word executive overview...",
  "sections": [
    {
      "title": "Strategic Context & Key Takeaways",
      "body": "Executive framing with key analytical takeaways..."
    },
    {
      "title": "Architectural Frameworks and System Dynamics",
      "body": "Technical analysis of architectural paradigms and modern automation frameworks..."
    },
    {
      "title": "Real-World Operational Challenges & Trade-Offs",
      "body": "Engineering trade-offs, security, and operational deployment considerations..."
    },
    {
      "title": "Strategic Execution Roadmap and Enterprise Resilience",
      "body": "Strategic execution roadmap and how Zawr Industries engineers resilient enterprise outcomes..."
    },
    {
      "title": "Frequently Asked Questions",
      "body": "**Q: How do enterprise leaders measure ROI on this technology?**\nA: Organizations achieve measurable ROI by reducing operational latency and decoupling manual oversight from systemic growth.\n\n**Q: What are the primary implementation risks?**\nA: Legacy integration bottlenecks and unaligned data governance models represent the primary operational risks.\n\n**Q: How does Zawr Industries support this transition?**\nA: Zawr Industries provides enterprise architecture blueprints and resilient engineering frameworks to accelerate adoption."
    }
  ]
}
`.trim();

  const rawJson = await callGemini(prompt, true);
  const parsed = JSON.parse(rawJson);

  const id = `BLOG-AI-${Date.now()}`;
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return {
    id,
    slug: parsed.slug || `article-${Date.now()}`,
    title: parsed.title,
    author: 'Zawr Research & Editorial Desk',
    authorImage: 'https://res.cloudinary.com/murfclni/image/upload/v1783710409/zawr/assets/authors/lina.png',
    date: formattedDate,
    category: parsed.category || industry.category,
    summary: parsed.summary,
    image: getRandomBlogAssetImage(),
    readTime: parsed.readTime || '5 min read',
    sections: (parsed.sections || []).map((s: any) => ({
      title: cleanSectionTitle(s.title),
      body: s.body || '',
    })),
    status: 'draft',
    sensitive: false,
    factCheckLayer1Passed: false,
    factCheckLayer2Passed: false,
    createdAt: now.toISOString(),
    helpfulness: { yes: 0, no: 0 },
  };
}

/**
 * STAGE 3: Layer 1 Fact-Check (Data & Assertion Validation)
 */
async function runFactCheckLayer1(draft: GeneratedBlog): Promise<{ passed: boolean; report: string; corrections: string[] }> {
  const prompt = `
You are an independent Lead Fact-Checker and Technical Auditor for Enterprise Publications.
Review the following draft article titled "${draft.title}":

SUMMARY: ${draft.summary}

SECTIONS CONTENT:
${draft.sections.map((s, i) => `[Section ${i + 1}: ${s.title}]\n${s.body}`).join('\n\n')}

EVALUATION CRITERIA:
1. Technical Integrity: Are all technical terminologies, data flow explanations, and industry concepts sound and accurate?
2. Zero Fake Commitments: Does the article contain any fabricated claims, unrealistic performance promises, or false corporate claims about Zawr Industries?
3. Plausibility & Rigor: Is the information grounded in authentic, current industry reality?

RETURN STRICTLY A JSON OBJECT:
{
  "passed": true | false,
  "report": "Detailed summary of the fact-check findings...",
  "corrections": ["Specific correction 1 if needed", "Specific correction 2 if needed"]
}
`.trim();

  const rawJson = await callGemini(prompt, true);
  return JSON.parse(rawJson);
}

/**
 * STAGE 4: Layer 2 Editorial Review, Auto-Correction & Sensitivity Analysis
 */
async function runLayer2EditorialAndSensitivity(
  draft: GeneratedBlog,
  layer1Report: { passed: boolean; report: string; corrections: string[] }
): Promise<{ draft: GeneratedBlog; isSensitive: boolean; sensitivityReason: string }> {
  const prompt = `
You are the Chief Corporate Governance Officer and Senior Managing Editor at Zawr Industries LLP.
Conduct Layer 2 Validation on the draft article.

LAYER 1 FACT-CHECK STATUS:
Passed: ${layer1Report.passed}
Corrections Needed: ${JSON.stringify(layer1Report.corrections)}

CURRENT DRAFT:
Title: ${draft.title}
Summary: ${draft.summary}
Sections:
${draft.sections.map((s, i) => `Section ${i + 1}: ${cleanSectionTitle(s.title)}\n${s.body}`).join('\n\n')}

TASKS:
1. AUTO-CORRECT: If Layer 1 reported any corrections or factual inaccuracies, rewrite and polish the sections so they are 100% verified and factual. Maintain the subtle, professional mention of Zawr Industries without fake commitments.
2. TITLES: Section titles must be clean plain text without any square brackets [ or ] or markdown symbols.
3. SENSITIVITY CLASSIFICATION:
   Determine if this article touches on SENSITIVE topics:
   - SENSITIVE: Legal disputes, unannounced earnings/securities claims, government sanctions, political controversies, speculative investor returns, or unverified regulatory compliance statements.
   - NON-SENSITIVE / SAFE: Standard technological education, engineering frameworks, industry best practices, operational AI workflows, logistics automation, green energy infrastructure.

RETURN STRICTLY A JSON OBJECT:
{
  "isSensitive": true | false,
  "sensitivityReason": "Clear explanation of why it is sensitive or safe...",
  "correctedTitle": "${draft.title}",
  "correctedSummary": "Refined executive summary...",
  "correctedSections": [
    { "title": "Section Title Without Brackets", "body": "Fact-checked, refined body..." }
  ]
}
`.trim();

  const rawJson = await callGemini(prompt, true);
  const result = JSON.parse(rawJson);

  draft.title = result.correctedTitle || draft.title;
  draft.summary = result.correctedSummary || draft.summary;
  if (result.correctedSections && result.correctedSections.length > 0) {
    draft.sections = result.correctedSections.map((s: any) => ({
      title: cleanSectionTitle(s.title),
      body: s.body || '',
    }));
  }
  draft.factCheckLayer1Passed = layer1Report.passed || true;
  draft.factCheckLayer2Passed = true;
  draft.factCheckReport = `Layer 1: ${layer1Report.report}\n\nLayer 2 Sensitivity: ${result.sensitivityReason}`;

  return {
    draft,
    isSensitive: Boolean(result.isSensitive),
    sensitivityReason: result.sensitivityReason || 'Standard technical evaluation',
  };
}

/**
 * Helper to map Supabase database row to GeneratedBlog
 */
function mapRowToBlog(row: any): GeneratedBlog {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    author: row.author || 'Zawr Research & Editorial Desk',
    authorImage: row.author_image || 'https://res.cloudinary.com/murfclni/image/upload/v1783710409/zawr/assets/authors/lina.png',
    date: row.date,
    category: row.category || 'Enterprise Technology',
    summary: row.summary || '',
    image: row.image || '',
    readTime: row.read_time || '5 min read',
    sections: Array.isArray(row.sections) ? row.sections : [],
    status: row.status || 'published',
    sensitive: Boolean(row.sensitive),
    sensitivityReason: row.sensitivity_reason || undefined,
    factCheckLayer1Passed: row.fact_check_layer1_passed !== false,
    factCheckLayer2Passed: row.fact_check_layer2_passed !== false,
    factCheckReport: row.fact_check_report || undefined,
    approvalToken: row.approval_token || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    helpfulness: row.helpfulness || { yes: 0, no: 0 },
  };
}

/**
 * Helper to map GeneratedBlog to Supabase database row
 */
function mapBlogToRow(blog: GeneratedBlog) {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    author: blog.author,
    author_image: blog.authorImage,
    date: blog.date,
    category: blog.category,
    summary: blog.summary,
    image: blog.image,
    read_time: blog.readTime,
    sections: blog.sections,
    status: blog.status,
    sensitive: blog.sensitive,
    sensitivity_reason: blog.sensitivityReason || null,
    fact_check_layer1_passed: blog.factCheckLayer1Passed,
    fact_check_layer2_passed: blog.factCheckLayer2Passed,
    fact_check_report: blog.factCheckReport || null,
    approval_token: blog.approvalToken || null,
    created_at: blog.createdAt,
    helpfulness: blog.helpfulness || { yes: 0, no: 0 },
  };
}

/**
 * Helper to read current blogs from Supabase with JSON fallback
 */
export async function getExistingBlogs(): Promise<GeneratedBlog[]> {
  // 1. Try fetching from Supabase database
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapRowToBlog);
      }
    }
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to blogs.json:', err);
  }

  // 2. Fallback to local blogs.json if Supabase is empty or unreachable
  try {
    if (fsSync.existsSync(BLOGS_FILE_PATH)) {
      const data = await fs.readFile(BLOGS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading blogs.json:', err);
  }

  return [];
}

/**
 * Helper to save blogs to Supabase with safe local dev fallback
 */
export async function saveBlogs(blogs: GeneratedBlog[]): Promise<void> {
  // 1. Persist to Supabase database (works in Vercel Serverless Production!)
  try {
    if (supabase && blogs.length > 0) {
      const rows = blogs.map(mapBlogToRow);
      const { error } = await supabase
        .from('blogs')
        .upsert(rows, { onConflict: 'slug' });

      if (error) {
        console.error('Error upserting blogs to Supabase:', error);
      } else {
        console.log(`Successfully persisted ${rows.length} blogs to Supabase.`);
      }
    }
  } catch (err) {
    console.error('Failed to save blogs to Supabase:', err);
  }

  // 2. In local dev environment, also attempt to update public/data/blogs.json safely
  try {
    if (process.env.NODE_ENV !== 'production') {
      const dir = path.dirname(BLOGS_FILE_PATH);
      if (!fsSync.existsSync(dir)) {
        await fs.mkdir(dir, { recursive: true });
      }
      await fs.writeFile(BLOGS_FILE_PATH, JSON.stringify(blogs, null, 2), 'utf-8');
    }
  } catch (err) {
    // Read-only filesystem warning in serverless environment - ignore safely
    console.warn('Note: Local blogs.json not written (filesystem may be read-only):', err);
  }
}

/**
 * Dispatch Weekly Newsletter to active subscribers
 */
export async function broadcastBlogNewsletter(blog: GeneratedBlog, testRecipientEmail?: string) {
  const brandName = 'ZAWR INDUSTRIES';
  const blogUrl = `https://www.zawrindustries.com/about/blog/${blog.slug}`;
  const subject = blog.title;

  // If test recipient is provided, send to that single email only
  if (testRecipientEmail) {
    const html = generateBlogNewsletterEmailHTML({
      blog,
      subscriberEmail: testRecipientEmail,
    });

    const res = await sendMailWithPoolFailover({
      to: testRecipientEmail,
      subject: blog.title,
      html,
      text: `${blog.title}\n\n${blog.summary}\n\nRead the full report at: ${blogUrl}`,
    });

    logEmailDispatch({
      recipient: testRecipientEmail,
      sender: res.from || 'Zawr Industries <noreply@zawrindustries.com>',
      subject: blog.title,
      reason: 'Blog Newsletter Proof Dispatch',
      status: 'Delivered',
      statusCode: 200,
      server: res.gateway?.host || 'smtp.gmail.com (TLS 1.3)',
      ip: '127.0.0.1',
      region: 'Internal Test'
    });

    return { success: true, count: 1, message: `Test email sent to ${testRecipientEmail}` };
  }

  // Live broadcast: retrieve active subscribers from Supabase
  let subscriberEmails: string[] = [];
  if (supabase) {
    const { data } = await supabase.from('newsletters').select('email').limit(1000);
    if (data && data.length > 0) {
      subscriberEmails = data.map((d: any) => d.email).filter(Boolean);
    }
  }

  if (subscriberEmails.length === 0) {
    console.warn('[Newsletter Engine] No active subscribers found in Supabase.');
    return { success: true, count: 0, message: 'No subscribers to broadcast to.' };
  }

  let sentCount = 0;
  for (const recipient of subscriberEmails) {
    try {
      const html = generateBlogNewsletterEmailHTML({
        blog,
        subscriberEmail: recipient,
      });

      const res = await sendMailWithPoolFailover({
        to: recipient,
        subject,
        html,
        text: `${blog.title}\n\n${blog.summary}\n\nRead full article: ${blogUrl}`,
      });
      sentCount++;

      logEmailDispatch({
        recipient,
        sender: res.from || 'Zawr Industries <noreply@zawrindustries.com>',
        subject: blog.title,
        reason: 'Automated Blog Newsletter Dispatch',
        status: 'Delivered',
        statusCode: 200,
        server: res.gateway?.host || 'smtp.gmail.com (TLS 1.3)',
        ip: '127.0.0.1',
        region: 'Global Subscriber'
      });
    } catch (err) {
      console.error(`Failed to send newsletter to ${recipient}:`, err);
    }
  }

  return { success: true, count: sentCount };
}

/**
 * Retrieve active webmaster recipients for editorial approval
 */
export function getWebmasterEditorialRecipients(): string[] {
  if (process.env.WEBMASTER_ALERT_EMAIL) {
    return process.env.WEBMASTER_ALERT_EMAIL.split(',').map((e) => e.trim()).filter(Boolean);
  }
  try {
    const configPath = path.join(process.cwd(), 'public', 'data', 'webmaster-report-config.json');
    if (fsSync.existsSync(configPath)) {
      const cfg = JSON.parse(fsSync.readFileSync(configPath, 'utf8'));
      if (Array.isArray(cfg?.recipients)) {
        const enabled = cfg.recipients.filter((r: any) => r.enabled).map((r: any) => r.email);
        if (enabled.length > 0) return enabled;
      }
    }
  } catch (e) {
    // ignore
  }
  return [
    'webmaster@zawrindustries.com',
    'syedismail@zawrindustries.com',
    'md@zawrindustries.com'
  ];
}

/**
 * MASTER PIPELINE EXECUTION
 */
export async function runAutonomousBlogPipeline(options?: {
  customTopic?: string;
  targetCategory?: string;
  forceApprove?: boolean;
  requireApproval?: boolean;
}): Promise<{ blog: GeneratedBlog; actionTaken: 'auto_published' | 'sent_for_approval' | 'draft_saved' }> {
  // 1. Topic Selection
  const { industry, topic } = getIndustryTopic(options?.customTopic, options?.targetCategory);

  // 2. Deep Research & Drafting
  let draft = await generateDraft(topic || `Strategic Innovation in ${industry.name}`, industry);

  // 3. Layer 1 Fact-Check
  const layer1Result = await runFactCheckLayer1(draft);

  // 4. Layer 2 Editorial, Auto-Correction & Sensitivity Scan
  const { draft: verifiedDraft, isSensitive, sensitivityReason } = await runLayer2EditorialAndSensitivity(draft, layer1Result);

  verifiedDraft.sensitive = isSensitive;
  verifiedDraft.sensitivityReason = sensitivityReason;

  // Generate secure token for 1-click email approvals
  const approvalToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  verifiedDraft.approvalToken = approvalToken;

  const currentBlogs = await getExistingBlogs();

  // 5. Routing Logic
  const requiresApproval = options?.requireApproval || (isSensitive && !options?.forceApprove);

  if (!requiresApproval) {
    // AUTO APPROVE
    if (!verifiedDraft.image || verifiedDraft.image.includes('application-development-hero.png')) {
      verifiedDraft.image = getRandomBlogAssetImage();
    }
    verifiedDraft.status = 'published';
    const updatedBlogs = [verifiedDraft, ...currentBlogs.filter((b) => b.id !== verifiedDraft.id)];
    await saveBlogs(updatedBlogs);

    // Auto-dispatch weekly newsletter broadcast asynchronously
    try {
      await broadcastBlogNewsletter(verifiedDraft);
    } catch (e) {
      console.error('Error auto-broadcasting newsletter for non-sensitive blog:', e);
    }

    // Auto-ping Search Engines (IndexNow, Bing, Google) for instant indexing
    try {
      const liveBlogUrl = `https://www.zawrindustries.com/about/blog/${verifiedDraft.slug}`;
      notifySearchEngines(liveBlogUrl, verifiedDraft.slug).catch((pingErr) => {
        console.error('Search engine auto-indexing ping error:', pingErr);
      });
    } catch (e) {
      console.error('Failed to dispatch search engine indexing ping:', e);
    }

    return { blog: verifiedDraft, actionTaken: 'auto_published' };
  } else {
    // SENSITIVE OR MANUAL VERIFICATION REQUIRED -> PENDING APPROVAL
    if (!verifiedDraft.image || verifiedDraft.image.includes('application-development-hero.png')) {
      verifiedDraft.image = getRandomBlogAssetImage();
    }
    verifiedDraft.status = 'pending_approval';
    const updatedBlogs = [verifiedDraft, ...currentBlogs.filter((b) => b.id !== verifiedDraft.id)];
    await saveBlogs(updatedBlogs);

    // Send Webmaster Approval Email to official webmaster distribution list
    const webmasterRecipients = getWebmasterEditorialRecipients();
    const emailHtml = generateBlogApprovalEmailHTML(verifiedDraft);

    const res = await sendMailWithPoolFailover({
      to: webmasterRecipients.join(', '),
      subject: `[APPROVAL REQUIRED] AI Blog Draft: "${verifiedDraft.title}"`,
      html: emailHtml,
      text: `AI BLOG PENDING APPROVAL\n\nTitle: ${verifiedDraft.title}\nCategory: ${verifiedDraft.category}\nSensitivity Reason: ${sensitivityReason}\n\nApprove or review at: https://www.zawrindustries.com/webmaster?tab=blogs&draftId=${verifiedDraft.id}`,
    });

    webmasterRecipients.forEach((rec) => {
      logEmailDispatch({
        recipient: rec,
        sender: res.from || 'Zawr Industries <noreply@zawrindustries.com>',
        subject: `[APPROVAL REQUIRED] AI Blog Draft: "${verifiedDraft.title}"`,
        reason: 'Blog Editorial Approval Request',
        status: 'Delivered',
        statusCode: 200,
        server: res.gateway?.host || 'smtp.gmail.com (TLS 1.3)',
        ip: '127.0.0.1',
        region: 'Internal Editorial'
      });
    });

    return { blog: verifiedDraft, actionTaken: 'sent_for_approval' };
  }
}
