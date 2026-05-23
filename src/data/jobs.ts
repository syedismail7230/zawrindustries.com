export const jobCategories = [
  {
    category: "Software Development & Engineering",
    jobs: [
      {
        id: "vp-technology",
        title: "VP Technology",
        location: "Remote / Hybrid",
        role: "Strategic leader of the technology and engineering function.",
        responsibilities: [
          "Define and implement technology strategy aligned with business objectives.",
          "Oversee end-to-end software development lifecycle and engineering excellence.",
          "Ensure scalability, performance, and security of all platforms.",
          "Evaluate emerging technologies and drive innovation.",
          "Collaborate with other VPs for business-tech alignment."
        ],
        reporting: "CEO"
      },
      {
        id: "engineering-manager",
        title: "Engineering Manager",
        location: "Remote / Hybrid",
        role: "Operational leader managing development teams.",
        responsibilities: [
          "Translate product requirements into technical roadmaps.",
          "Manage sprint planning, resource allocation, and delivery timelines.",
          "Conduct performance reviews and mentor engineers.",
          "Ensure code quality, testing, and compliance with standards.",
          "Act as liaison between VP Tech and developers."
        ],
        reporting: "VP Tech"
      },
      {
        id: "senior-software-engineer",
        title: "Senior Software Engineers",
        location: "Remote / Hybrid",
        role: "Lead developers responsible for high-level system design and execution.",
        responsibilities: [
          "Architect and implement scalable, secure, and high-performing modules.",
          "Conduct code reviews and mentor junior engineers.",
          "Optimize performance and guide best practices in development.",
          "Collaborate closely with UI/UX, DevOps, and QA teams."
        ],
        reporting: "Engineering Manager"
      },
      {
        id: "software-engineer",
        title: "Software Engineers",
        location: "Remote / Hybrid",
        role: "Core developers building and maintaining software features.",
        responsibilities: [
          "Develop, test, and deploy software components.",
          "Write clean, maintainable, and efficient code.",
          "Debug and resolve technical issues.",
          "Collaborate in agile sprints and standups."
        ],
        reporting: "Senior Software Engineer"
      },
      {
        id: "devops-infrastructure",
        title: "DevOps & Infrastructure",
        location: "Remote / Hybrid",
        role: "Ensure smooth deployment, monitoring, and scaling of applications.",
        responsibilities: [
          "Automate CI/CD pipelines and streamline release management.",
          "Manage servers, cloud environments, and infrastructure as code.",
          "Ensure defect tracking and timely bug resolution.",
          "Enforce security, compliance, and system reliability."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "qa-testing",
        title: "QA & Testing",
        location: "Remote / Hybrid",
        role: "Guarantee product quality and performance.",
        responsibilities: [
          "Develop and execute manual & automated test cases.",
          "Conduct regression, functional, integration, and load testing.",
          "Ensure defect tracking and timely bug resolution.",
          "Maintain QA documentation and reports."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "ui-ux",
        title: "UI/UX",
        location: "Remote / Hybrid",
        role: "Design user-friendly and visually appealing digital experiences.",
        responsibilities: [
          "Conduct user research and build design wireframes, mockups, and prototypes.",
          "Optimize applications for usability and accessibility.",
          "Work closely with developers for design implementation.",
          "Ensure consistency across web, mobile, and embedded systems."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "full-stack-development",
        title: "Full Stack Development",
        location: "Remote / Hybrid",
        role: "Core software builders across frontend and backend systems.",
        responsibilities: [
          "Develop scalable web and mobile applications.",
          "Build APIs, integrate databases, and optimize performance.",
          "Collaborate with UI/UX and QA teams for full lifecycle development.",
          "Maintain code quality, version control, and best practices."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "ai-ml",
        title: "AI/ML",
        location: "Remote / Hybrid",
        role: "Develop intelligent solutions leveraging data and automation.",
        responsibilities: [
          "Design and train machine learning models.",
          "Implement predictive analytics and recommendation systems.",
          "Optimize algorithms for speed and accuracy.",
          "Collaborate with Data Science for real-world deployments."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "cloud-engineering",
        title: "Cloud Engineering",
        location: "Remote / Hybrid",
        role: "Architect and manage scalable cloud solutions.",
        responsibilities: [
          "Deploy and manage cloud-based applications (AWS, Azure, GCP).",
          "Optimize storage, compute, and networking in the cloud.",
          "Ensure compliance with data security and governance.",
          "Collaborate with DevOps for cloud automation."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "erp-development",
        title: "ERP Development",
        location: "Remote / Hybrid",
        role: "Develop enterprise-grade ERP modules.",
        responsibilities: [
          "Build and customize ERP solutions for finance, HR, supply chain, etc.",
          "Ensure integrations with third-party applications.",
          "Optimize ERP performance and workflows.",
          "Provide ongoing support and upgrades."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "data-science",
        title: "Data Science",
        location: "Remote / Hybrid",
        role: "Transform raw data into actionable insights.",
        responsibilities: [
          "Collect, process, and analyze structured & unstructured data.",
          "Build dashboards, reports, and KPIs for business intelligence.",
          "Support AI/ML teams with data pipelines.",
          "Work on predictive and prescriptive analytics."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "cybersecurity-infosec",
        title: "Cybersecurity / InfoSec Engineering",
        location: "Remote / Hybrid",
        role: "Safeguard enterprise systems, networks, and applications from threats.",
        responsibilities: [
          "Conduct penetration testing, vulnerability scans, and threat modeling.",
          "Perform regular security audits and enforce compliance (ISO 27001, SOC2, GDPR, HIPAA).",
          "Implement encryption, identity & access management, and endpoint security.",
          "Develop incident response plans and disaster recovery procedures."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "mobile-development",
        title: "Mobile Development (iOS & Android Engineers)",
        location: "Remote / Hybrid",
        role: "Build and maintain enterprise-grade mobile applications.",
        responsibilities: [
          "Develop native and cross-platform apps for iOS and Android.",
          "Integrate mobile applications with backend APIs and enterprise systems.",
          "Optimize app performance, UI/UX, and offline functionality.",
          "Work on predictive and prescriptive analytics."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "embedded-systems",
        title: "Embedded / Systems Engineering",
        location: "Remote / Hybrid",
        role: "Design and implement low-level software and hardware integrations.",
        responsibilities: [
          "Develop firmware, device drivers, and real-time operating system components.",
          "Ensure seamless hardware-software integration for IoT, automotive, or smart devices.",
          "Optimize kernel performance, bootloaders, and system stability.",
          "Work with chipsets, sensors, and industrial controllers."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "api-integration",
        title: "API & Integration Engineering",
        location: "Remote / Hybrid",
        role: "Manage system interoperability and API lifecycle management.",
        responsibilities: [
          "Design and develop APIs for internal and external systems.",
          "Manage API versioning, authentication, throttling, and monitoring.",
          "Integrate third-party services, SaaS platforms, and enterprise applications.",
          "Enable microservices orchestration and event-driven architecture."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "data-engineering",
        title: "Data Engineering",
        location: "Remote / Hybrid",
        role: "Develop scalable data pipelines and ensure high-quality datasets.",
        responsibilities: [
          "Build ETL/ELT pipelines and real-time data streaming frameworks.",
          "Manage data warehouses, data lakes, and storage solutions.",
          "Ensure data governance, quality, and lineage for compliance.",
          "Enable AI/ML and BI teams with structured, reliable datasets."
        ],
        reporting: "Head of Software Development & Engineering"
      },
      {
        id: "product-engineering",
        title: "Product Engineering / Solution Architects",
        location: "Remote / Hybrid",
        role: "Bridge business requirements with scalable technical solutions.",
        responsibilities: [
          "Define system architecture aligned with enterprise objectives.",
          "Conduct design reviews, proof-of-concepts, and technology evaluations.",
          "Ensure scalability, resilience, and security in technical solutions.",
          "Collaborate with cross-functional teams to deliver end-to-end solutions."
        ],
        reporting: "Head of Software Development & Engineering"
      }
    ]
  },
  {
    category: "Human Resources (HR) & Talent Management",
    jobs: [
      {
        id: "hr-head",
        title: "HR Head",
        location: "On-site / Hybrid",
        role: "Strategic leader of the HR function.",
        responsibilities: [
          "Design and implement HR strategies aligned with business goals.",
          "Advise management on workforce planning, talent management, and succession planning.",
          "Ensure compliance with labor laws and regulations.",
          "Oversee compensation, benefits, and performance management frameworks.",
          "Build a strong company culture and employee engagement programs."
        ],
        reporting: "CEO and all VPs"
      },
      {
        id: "talent-acquisition",
        title: "Talent Acquisition",
        location: "Hybrid",
        role: "Recruiters responsible for sourcing and hiring.",
        responsibilities: [
          "Manage end-to-end recruitment (job posting, shortlisting, interviews, offers).",
          "Build relationships with universities, hiring agencies, and job portals.",
          "Maintain a talent pipeline for critical IT roles.",
          "Ensure diversity and inclusion in hiring.",
          "Conduct onboarding for new employees."
        ],
        reporting: "HR Head"
      },
      {
        id: "hr-business-partners",
        title: "HR Business Partners",
        location: "Hybrid",
        role: "Bridge between HR and business units/projects.",
        responsibilities: [
          "Work closely with team leads and managers to understand workforce needs.",
          "Mediate employee relations issues and resolve conflicts.",
          "Manage performance reviews, training, and career development.",
          "Provide guidance on employee engagement, retention, and policies.",
          "Support managers in disciplinary actions, promotions, and internal movements."
        ],
        reporting: "HR Head"
      },
      {
        id: "admin-facilities",
        title: "Admin/Facilities",
        location: "On-site",
        role: "Manage office administration and employee support.",
        responsibilities: [
          "Handle office space, infrastructure, and equipment.",
          "Oversee travel, transport, and vendor management.",
          "Maintain workplace safety and compliance.",
          "Support events, employee welfare, and general operations.",
          "Act as the link between HR and operations for smooth functioning."
        ],
        reporting: "HR Head"
      },
      {
        id: "recruitment-intern",
        title: "Recruitment & Talent Acquisition Intern",
        location: "Remote / Hybrid",
        role: "Assist in the hiring lifecycle.",
        responsibilities: [
          "Support in sourcing candidates through job portals, LinkedIn, and internal referrals.",
          "Screen resumes and conduct preliminary shortlisting.",
          "Coordinate interview schedules between candidates and hiring managers.",
          "Assist in preparing job descriptions and internship postings.",
          "Maintain candidate databases and recruitment dashboards."
        ],
        reporting: "HR Head / HR Manager"
      },
      {
        id: "engagement-intern",
        title: "Employee Engagement & Onboarding Intern",
        location: "Remote / Hybrid",
        role: "Focus on employee lifecycle and culture.",
        responsibilities: [
          "Assist in onboarding new employees (documentation, induction scheduling, welcome kits).",
          "Support planning of employee engagement activities/events.",
          "Maintain and update employee records in HRMS.",
          "Collect and analyze employee feedback to improve engagement initiatives.",
          "Shadow senior HR executives in employee relation cases."
        ],
        reporting: "HR Head / HR Manager"
      },
      {
        id: "training-intern",
        title: "Training & Development Intern",
        location: "Remote / Hybrid",
        role: "Support skill-building and organizational learning.",
        responsibilities: [
          "Help coordinate internal/external training programs.",
          "Prepare training materials, attendance records, and feedback forms.",
          "Track learning progress and maintain training dashboards.",
          "Assist in creating e-learning content (PowerPoints, quizzes, guides).",
          "Research new L&D trends for IT talent upskilling."
        ],
        reporting: "HR Head / HR Manager"
      },
      {
        id: "hr-analytics-intern",
        title: "HR Analytics & Compliance Intern",
        location: "Remote / Hybrid",
        role: "Data-driven support for decision-making.",
        responsibilities: [
          "Support in maintaining HR databases (attendance, leave, attrition, performance).",
          "Assist in generating monthly HR reports (hiring stats, attrition trends, payroll inputs).",
          "Conduct research on HR compliance, labor laws, and best practices.",
          "Help in drafting HR policies and standard operating procedures (SOPs).",
          "Provide administrative assistance in audits or HR documentation."
        ],
        reporting: "HR Head / HR Manager"
      }
    ]
  },
  {
    category: "Sales & Business Development",
    jobs: [
      {
        id: "vp-business-acquisition",
        title: "VP Business Acquisition (Chief of Business)",
        location: "Hybrid",
        role: "Strategic head of the entire sales function.",
        responsibilities: [
          "Define and execute long-term sales strategy aligned with corporate goals.",
          "Set revenue targets and ensure achievement through the sales hierarchy.",
          "Develop partnerships, key accounts, and enterprise-level sales opportunities.",
          "Collaborate with Marketing, Product, and Operations for integrated growth.",
          "Monitor industry trends, competitor activities, and market shifts.",
          "Build high-performance culture through incentives and recognition."
        ],
        reporting: "CEO"
      },
      {
        id: "vp-sales",
        title: "Vice President - Sales (VP-Sales)",
        location: "Hybrid (North & South / East & West)",
        role: "Regional leadership of sales strategy and execution.",
        responsibilities: [
          "Translate VP Business Acquisition's strategy into actionable regional plans.",
          "Monitor quarterly targets, pipelines, and deal closures in the region.",
          "Develop and mentor Regional Sales Managers.",
          "Establish regional partnerships and customer relationships.",
          "Report region-specific risks and opportunities to VP Business Acquisition."
        ],
        reporting: "VP Business Acquisition"
      },
      {
        id: "regional-sales-manager",
        title: "Regional Sales Managers (RSMs)",
        location: "Hybrid (Zone-wise)",
        role: "Mid-level managers handling zonal sales operations.",
        responsibilities: [
          "Drive sales across multiple territories in the zone.",
          "Coordinate with Area Sales Managers for target achievement.",
          "Maintain relationships with large accounts in the region.",
          "Analyze sales data, competitor insights, and customer needs.",
          "Ensure compliance with pricing, discounting, and sales policies."
        ],
        reporting: "VP - Sales"
      },
      {
        id: "area-sales-manager",
        title: "Area Sales Managers (ASMs)",
        location: "Field / Hybrid",
        role: "Supervisors of multiple field territories.",
        responsibilities: [
          "Lead and coach Sales Executives in their area.",
          "Allocate monthly targets and track achievement.",
          "Conduct sales reviews, field visits, and customer meetings.",
          "Handle escalations from key clients in their area.",
          "Drive local promotional campaigns with Marketing."
        ],
        reporting: "Regional Sales Manager"
      },
      {
        id: "senior-sales-executive",
        title: "Senior Sales Executives/ TLs",
        location: "Field / Hybrid",
        role: "Experienced sales professionals driving high-value deals.",
        responsibilities: [
          "Manage B2B / B2C accounts with larger revenue potential.",
          "Negotiate pricing, contracts, and long-term agreements.",
          "Mentor junior Sales Executives on sales processes.",
          "Achieve individual targets and contribute to team quotas.",
          "Provide customer feedback to product and marketing teams."
        ],
        reporting: "Area Sales Manager"
      },
      {
        id: "sales-executive",
        title: "Sales Executives",
        location: "Field",
        role: "Frontline field force driving customer acquisition and retention.",
        responsibilities: [
          "Identify, prospect, and convert leads into clients.",
          "Meet daily, weekly, and monthly sales activity goals.",
          "Execute product demonstrations and presentations.",
          "Handle customer queries and provide solutions.",
          "Update CRM with accurate sales data."
        ],
        reporting: "Senior Sales Executive / Area Sales Manager"
      },
      {
        id: "sales-support",
        title: "Sales Support & Coordination (Inside Sales + Back Office)",
        location: "On-site / Hybrid",
        role: "Operational backbone of the sales function.",
        responsibilities: [
          "Manage CRM, sales data entry, and reporting.",
          "Support sales teams with proposals, quotations, and documentation.",
          "Follow up with leads, schedule meetings, and nurture warm prospects.",
          "Coordinate with Operations for smooth order processing.",
          "Assist in preparing sales dashboards for leadership."
        ],
        reporting: "Area Sales Manager / Regional Sales Manager"
      },
      {
        id: "sales-intern",
        title: "Sales Interns",
        location: "Field / Hybrid",
        role: "Entry-level trainees supporting the sales team in operations and fieldwork.",
        responsibilities: [
          "Assist sales executives in lead generation and client prospecting.",
          "Shadow experienced salespeople to understand client handling.",
          "Conduct market surveys and competitor analysis.",
          "Support in preparing sales pitches, presentations, and proposals.",
          "Handle documentation and update CRM under supervision.",
          "Participate in client calls and field visits for experiential learning.",
          "Provide feedback on customer behavior and preferences observed during interactions.",
          "Learn and adapt sales techniques as per company guidelines."
        ],
        reporting: "Sales Executives (day-to-day guidance), Sales Managers (training and performance review)"
      }
    ]
  }
];
