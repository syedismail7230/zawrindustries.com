const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const jobCategories = [
  {
    category: "Software Development & Engineering",
    jobs: [
      { title: "VP Technology", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Engineering Manager", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Senior Software Engineers", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Software Engineers", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "DevOps & Infrastructure", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "QA & Testing", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "UI/UX", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Full Stack Development", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "AI/ML", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Cloud Engineering", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "ERP Development", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Data Science", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Cybersecurity / InfoSec Engineering", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Mobile Development", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Embedded / Systems Engineering", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "API & Integration Engineering", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Data Engineering", location: "Remote / Hybrid", type: "Full-time", status: "Active" },
      { title: "Product Engineering", location: "Remote / Hybrid", type: "Full-time", status: "Active" }
    ]
  },
  {
    category: "Human Resources",
    jobs: [
      { title: "HR Head", location: "On-site / Hybrid", type: "Full-time", status: "Active" },
      { title: "Talent Acquisition", location: "Hybrid", type: "Full-time", status: "Active" },
      { title: "HR Business Partners", location: "Hybrid", type: "Full-time", status: "Active" },
      { title: "Admin/Facilities", location: "On-site", type: "Full-time", status: "Active" },
      { title: "Recruitment Intern", location: "Remote / Hybrid", type: "Contract", status: "Active" },
      { title: "Engagement Intern", location: "Remote / Hybrid", type: "Contract", status: "Active" },
      { title: "Training Intern", location: "Remote / Hybrid", type: "Contract", status: "Active" },
      { title: "HR Analytics Intern", location: "Remote / Hybrid", type: "Contract", status: "Active" }
    ]
  },
  {
    category: "Sales & Business Development",
    jobs: [
      { title: "VP Business Acquisition", location: "Hybrid", type: "Full-time", status: "Active" },
      { title: "VP Sales", location: "Hybrid", type: "Full-time", status: "Active" },
      { title: "Regional Sales Managers", location: "Hybrid", type: "Full-time", status: "Active" },
      { title: "Area Sales Managers", location: "Field / Hybrid", type: "Full-time", status: "Active" },
      { title: "Senior Sales Executives", location: "Field / Hybrid", type: "Full-time", status: "Active" },
      { title: "Sales Executives", location: "Field", type: "Full-time", status: "Active" },
      { title: "Sales Support", location: "On-site / Hybrid", type: "Full-time", status: "Active" },
      { title: "Sales Interns", location: "Field / Hybrid", type: "Contract", status: "Active" }
    ]
  }
];

async function seedJobs() {
  console.log('Connecting to Supabase via REST...');
  
  let allJobs = [];
  for (const category of jobCategories) {
    for (const job of category.jobs) {
      allJobs.push({
        title: job.title,
        location: job.location,
        type: job.type,
        status: job.status,
        role: job.role || '',
        responsibilities: job.responsibilities || [],
        reporting: job.reporting || ''
      });
    }
  }

  const endpoint = `${supabaseUrl}/rest/v1/jobs`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(allJobs)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to insert jobs. Error:', response.status, response.statusText);
    console.error('Details:', errorText);
    if (errorText.includes('does not exist')) {
       console.log('\nHINT: The "jobs" table does not exist in Supabase! You must create it in the Supabase Dashboard first.');
       console.log('Columns needed: id (primary key), title (text), location (text), type (text), status (text)');
    }
  } else {
    const data = await response.json();
    console.log(`\nSUCCESS! Bulk inserted ${data.length} jobs into Supabase!`);
  }
}

seedJobs();
