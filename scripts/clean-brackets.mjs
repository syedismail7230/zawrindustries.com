import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';

async function cleanBrackets() {
  console.log('--- Cleaning square brackets from blogs.json and Supabase ---');

  // 1. Clean public/data/blogs.json
  const blogsPath = path.join(process.cwd(), 'public', 'data', 'blogs.json');
  const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));

  let cleanedCount = 0;
  blogs.forEach((blog) => {
    if (Array.isArray(blog.sections)) {
      blog.sections.forEach((sect) => {
        if (sect.title && (/^\[/.test(sect.title) || /\]$/.test(sect.title))) {
          const oldTitle = sect.title;
          sect.title = sect.title.replace(/^\[+|\s*\]+$/g, '').trim();
          console.log(`Cleaned local: "${oldTitle}" -> "${sect.title}"`);
          cleanedCount++;
        }
      });
    }
  });

  fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 2), 'utf8');
  console.log(`✅ Cleaned ${cleanedCount} section titles in public/data/blogs.json`);

  // 2. Clean Supabase database
  try {
    const { getSupabase } = await import('../src/lib/supabase.ts');
    const sb = getSupabase();
    if (!sb) {
      console.log('Supabase client not initialized, skipping DB update.');
      return;
    }

    const { data: dbBlogs, error } = await sb.from('blogs').select('id, sections');
    if (error) {
      console.error('Error querying Supabase blogs:', error.message);
      return;
    }

    let dbUpdated = 0;
    for (const b of dbBlogs) {
      if (Array.isArray(b.sections)) {
        let changed = false;
        const newSections = b.sections.map((sect) => {
          if (sect.title && (/^\[/.test(sect.title) || /\]$/.test(sect.title))) {
            changed = true;
            return {
              ...sect,
              title: sect.title.replace(/^\[+|\s*\]+$/g, '').trim(),
            };
          }
          return sect;
        });

        if (changed) {
          const { error: updateErr } = await sb
            .from('blogs')
            .update({ sections: newSections })
            .eq('id', b.id);
          if (updateErr) {
            console.error(`Error updating blog ${b.id}:`, updateErr.message);
          } else {
            console.log(`✅ Cleaned sections for DB blog ${b.id}`);
            dbUpdated++;
          }
        }
      }
    }
    console.log(`✅ Cleaned ${dbUpdated} blogs in Supabase database public.blogs`);
  } catch (err) {
    console.error('Supabase update error:', err);
  }
}

cleanBrackets();
