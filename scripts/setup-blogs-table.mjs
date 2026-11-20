import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Strip quotes if any
const cleanUrl = (url) => url ? url.replace(/^["']|["']$/g, '').trim() : '';

const connectionString = cleanUrl(process.env.DIRECT_URL) || cleanUrl(process.env.DATABASE_URL);

if (!connectionString) {
  console.error('No DIRECT_URL or DATABASE_URL found in .env.local');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  try {
    console.log('Connecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    // 1. Create table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.blogs (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        author TEXT DEFAULT 'Zawr Research & Editorial Desk',
        author_image TEXT DEFAULT 'https://res.cloudinary.com/murfclni/image/upload/v1783710409/zawr/assets/authors/lina.png',
        date TEXT,
        category TEXT DEFAULT 'Enterprise Technology',
        summary TEXT,
        image TEXT,
        read_time TEXT DEFAULT '5 min read',
        sections JSONB DEFAULT '[]'::jsonb,
        status TEXT DEFAULT 'published',
        sensitive BOOLEAN DEFAULT false,
        sensitivity_reason TEXT,
        fact_check_layer1_passed BOOLEAN DEFAULT true,
        fact_check_layer2_passed BOOLEAN DEFAULT true,
        fact_check_report TEXT,
        approval_token TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        helpfulness JSONB DEFAULT '{"yes": 0, "no": 0}'::jsonb
      );

      -- Enable RLS
      ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

      -- Create public read policy if not exists
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'blogs' AND policyname = 'Public read access for blogs'
        ) THEN
          CREATE POLICY "Public read access for blogs" ON public.blogs
            FOR SELECT USING (true);
        END IF;
      END $$;

      -- Create insert/update policy for anon & authenticated
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'blogs' AND policyname = 'Allow insert and update for blogs'
        ) THEN
          CREATE POLICY "Allow insert and update for blogs" ON public.blogs
            FOR ALL USING (true) WITH CHECK (true);
        END IF;
      END $$;
    `;

    console.log('Creating public.blogs table & RLS policies...');
    await client.query(createTableQuery);
    console.log('Table public.blogs is ready!');

    // 2. Seed existing blogs from public/data/blogs.json
    const blogsPath = path.join(process.cwd(), 'public', 'data', 'blogs.json');
    if (fs.existsSync(blogsPath)) {
      const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
      console.log(`Found ${blogs.length} seed blogs in blogs.json. Upserting into Supabase...`);

      for (const b of blogs) {
        const query = `
          INSERT INTO public.blogs (
            id, slug, title, author, author_image, date, category, summary, image,
            read_time, sections, status, sensitive, sensitivity_reason,
            fact_check_layer1_passed, fact_check_layer2_passed, fact_check_report,
            approval_token, created_at, helpfulness
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            summary = EXCLUDED.summary,
            sections = EXCLUDED.sections,
            image = EXCLUDED.image,
            status = EXCLUDED.status,
            helpfulness = EXCLUDED.helpfulness;
        `;

        const values = [
          b.id || `BLOG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          b.slug,
          b.title,
          b.author || 'Zawr Research & Editorial Desk',
          b.authorImage || 'https://res.cloudinary.com/murfclni/image/upload/v1783710409/zawr/assets/authors/lina.png',
          b.date,
          b.category || 'Enterprise Technology',
          b.summary || '',
          b.image || '',
          b.readTime || '5 min read',
          JSON.stringify(b.sections || []),
          b.status || 'published',
          Boolean(b.sensitive),
          b.sensitivityReason || null,
          b.factCheckLayer1Passed !== false,
          b.factCheckLayer2Passed !== false,
          b.factCheckReport || null,
          b.approvalToken || null,
          b.createdAt || new Date().toISOString(),
          JSON.stringify(b.helpfulness || { yes: 0, no: 0 }),
        ];

        await client.query(query, values);
      }
      console.log('Successfully synced all existing blogs into Supabase public.blogs table!');
    }

    const countRes = await client.query('SELECT count(*) FROM public.blogs;');
    console.log(`Total blogs in Supabase: ${countRes.rows[0].count}`);

  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

runMigration();
