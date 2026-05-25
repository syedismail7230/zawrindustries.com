import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { jobCategories } from '../src/data/jobs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedJobs() {
  console.log('Connecting to Supabase...');
  
  let insertedCount = 0;

  for (const category of jobCategories) {
    for (const job of category.jobs) {
      // We map the static fields to the expected DB schema
      const jobRecord = {
        title: job.title,
        location: job.location,
        type: 'Full-time', // Defaulting as the static data doesn't explicitly have type
        status: 'Active'
      };

      const { data, error } = await supabase.from('jobs').insert([jobRecord]).select();

      if (error) {
        console.error('Error inserting job:', job.title);
        console.error('Supabase Error:', error.message);
        console.log('HINT: Make sure the "jobs" table is created in Supabase with columns: id (serial/uuid primary key), title (text), location (text), type (text), status (text)');
        return;
      } else {
        console.log(`Inserted: ${job.title}`);
        insertedCount++;
      }
    }
  }

  console.log(`Successfully seeded ${insertedCount} jobs into Supabase!`);
}

seedJobs();
