/**
 * Advanced Bot & Spam Protection Engine for Zawr Industries
 * 
 * Protects public form endpoints (Sponsorship, Callback, Careers, Newsletter, Investor requests)
 * against automated bot floods, Gmail dot-trick spammers, gibberish generators, and brute-force tools.
 */

// In-memory sliding-window IP rate limiter
interface IPRateRecord {
  timestamps: number[];
  blockedUntil: number;
}

const ipSubmissionsMap = new Map<string, IPRateRecord>();

// Clean up stale IP records every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipSubmissionsMap.entries()) {
      if (record.blockedUntil < now && record.timestamps.length === 0) {
        ipSubmissionsMap.delete(ip);
      }
    }
  }, 10 * 60 * 1000);
}

export interface SpamCheckParams {
  ip?: string;
  companyName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  objectives?: string;
  message?: string;
  honeypot?: string;
  deliverables?: string | string[];
}

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
  score: number; // 0 to 100 (>= 40 is considered spam)
}

/**
 * Checks for excessive consonant clusters (common in random string generators like "Ojjywh", "Ehcmh", "Buvjpfzjs")
 */
function isGibberishWord(word: string): boolean {
  if (!word || word.length < 4) return false;
  
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length < 4) return false;

  // Check for 4 or more consecutive consonants (rare in real human names/words)
  const consonantClusters = clean.match(/[bcdfghjklmnpqrstvwxyz]{4,}/g);
  if (consonantClusters) {
    // Exceptions for common suffixes/prefixes (e.g., "sch", "tch", "ngth")
    const hasAllowed = consonantClusters.every(cluster => 
      cluster.includes('sch') || cluster.includes('ngth') || cluster.includes('rthm')
    );
    if (!hasAllowed) return true;
  }

  // Check consonant to vowel ratio for strings >= 5 chars
  const vowels = clean.match(/[aeiou]/g)?.length || 0;
  const consonants = clean.length - vowels;
  
  if (clean.length >= 5 && vowels === 0) return true;
  if (clean.length >= 6 && consonants / clean.length > 0.85) return true;

  return false;
}

/**
 * Detects Gmail dot-trick abuse (e.g. "e.xc.e.l.mo.m.j.j.1.0@gmail.com", "xu.x.o.h.ani.8.5@gmail.com")
 */
function isDotTrickSpamEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;

  const [localPart, domain] = email.trim().toLowerCase().split('@');
  if (!localPart || !domain) return false;

  const dotCount = (localPart.match(/\./g) || []).length;

  // If local part has 3 or more dots
  if (dotCount >= 3) return true;

  // If local part contains single-character separated by dots (e.g. "x.u.x.o")
  if (/\b[a-z0-9]\.[a-z0-9]\.[a-z0-9]\b/.test(localPart)) return true;

  return false;
}

/**
 * Evaluates submission against anti-spam heuristics
 */
export function evaluateSpamScore(params: SpamCheckParams): SpamCheckResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Honeypot trap (Instant 100% spam if filled)
  if (params.honeypot && params.honeypot.trim().length > 0) {
    return {
      isSpam: true,
      reason: 'Honeypot trap triggered by automated scraper bot',
      score: 100
    };
  }

  // 2. IP Rate Limiter (Max 3 submissions per 5 minutes per IP)
  if (params.ip) {
    const now = Date.now();
    const record = ipSubmissionsMap.get(params.ip) || { timestamps: [], blockedUntil: 0 };

    if (record.blockedUntil > now) {
      return {
        isSpam: true,
        reason: 'IP temporarily rate-limited due to high submission frequency',
        score: 100
      };
    }

    // Filter timestamps within last 5 minutes
    record.timestamps = record.timestamps.filter(t => now - t < 5 * 60 * 1000);
    record.timestamps.push(now);

    if (record.timestamps.length > 3) {
      record.blockedUntil = now + 15 * 60 * 1000; // 15 min lock
      ipSubmissionsMap.set(params.ip, record);
      return {
        isSpam: true,
        reason: 'Submission frequency exceeded threshold for IP',
        score: 100
      };
    }

    ipSubmissionsMap.set(params.ip, record);
  }

  // 3. Dot-trick spam email detection
  if (params.email && isDotTrickSpamEmail(params.email)) {
    score += 50;
    reasons.push('Dot-trick burner email format detected');
  }

  // 4. Gibberish company name check
  if (params.companyName) {
    const words = params.companyName.split(/\s+/).filter(w => !['llc', 'inc', 'ltd', 'corp', 'gmbh', 'pvt'].includes(w.toLowerCase()));
    for (const word of words) {
      if (isGibberishWord(word)) {
        score += 35;
        reasons.push(`Gibberish pattern in company name: "${word}"`);
        break;
      }
    }
  }

  // 5. Gibberish representative/full name check
  if (params.fullName) {
    const words = params.fullName.split(/\s+/);
    for (const word of words) {
      if (isGibberishWord(word)) {
        score += 40;
        reasons.push(`Gibberish pattern in representative name: "${word}"`);
        break;
      }
    }
  }

  // 6. Check for dummy N/A patterns across all text fields
  const allNA = (params.phone === 'N/A' || !params.phone) && 
                (params.objectives === 'N/A' || !params.objectives || params.objectives.length < 5);
  if (allNA && score > 0) {
    score += 20;
    reasons.push('Empty/N/A dummy payload combination');
  }

  // 7. Check if all deliverables checkboxes were blindly selected by a bot
  if (params.deliverables) {
    try {
      const delArr = typeof params.deliverables === 'string' ? JSON.parse(params.deliverables) : params.deliverables;
      if (Array.isArray(delArr) && delArr.length >= 10) {
        score += 25;
        reasons.push('All deliverable checkboxes blindly selected');
      }
    } catch {
      // ignore json parse error
    }
  }

  const isSpam = score >= 40;

  return {
    isSpam,
    reason: reasons.join('; ') || undefined,
    score
  };
}
