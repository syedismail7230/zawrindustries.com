import re
import json
import os

def clean_text(text):
    # Replace special quotes and formatting characters
    text = text.replace('\u2013', '-').replace('\u2014', '-').replace('\u201d', '"').replace('\u201c', '"')
    # replace multiple spaces and clean up
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

def main():
    with open('services_extracted.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    # Normalize all bullet point styles to standard '•'
    # DO NOT replace empty string!
    text = text.replace('\uFFFD', '•')
    text = text.replace('\u2022', '•')
    text = text.replace('\u0095', '•')

    pages = re.split(r'--- PAGE \d+ ---', text)
    print("Loaded", len(pages), "pages.")

    # Service pages mappings (1-indexed based on manual validation)
    service_pages = [
        {"name": "AI & Data Analytics", "slug": "ai-data-analytics", "start": 1, "end": 8},
        {"name": "Cloud", "slug": "cloud", "start": 9, "end": 18},
        {"name": "Cybersecurity", "slug": "cybersecurity", "start": 19, "end": 28},
        {"name": "Network Solutions", "slug": "network-solutions", "start": 29, "end": 38},
        {"name": "Industrial Autonomy & Engineering", "slug": "industrial-autonomy-and-engineering", "start": 39, "end": 48},
        {"name": "Enterprise Solutions", "slug": "enterprise-solutions", "start": 49, "end": 59},
        {"name": "Consulting", "slug": "consulting", "start": 60, "end": 67},
        {"name": "Software Development", "slug": "software-development", "start": 68, "end": 77},
        {"name": "Cognitive Business Operations", "slug": "cognitive-business-operations", "start": 78, "end": 87},
        {"name": "Web Development", "slug": "web-development", "start": 88, "end": 99},
        {"name": "Application Development", "slug": "application-development", "start": 100, "end": 110},
        {"name": "Startup MVP", "slug": "startup-mvp", "start": 111, "end": 121},
        {"name": "CRM Solution", "slug": "crm-solution", "start": 122, "end": 132},
        {"name": "CXM Solution", "slug": "cxm-solution", "start": 133, "end": 143},
        {"name": "Digital Marketing", "slug": "digital-marketing", "start": 144, "end": 154},
        {"name": "Blockchain", "slug": "blockchain", "start": 155, "end": 164},
        {"name": "IoT", "slug": "iot", "start": 165, "end": 176},
        {"name": "DevOps", "slug": "devops", "start": 177, "end": 187},
        {"name": "Unit Testing", "slug": "unit-test", "start": 188, "end": 197},
        {"name": "Quality Assurance", "slug": "quality-assurance", "start": 198, "end": 208},
        {"name": "Workplace Transformation", "slug": "workplace-transformation", "start": 209, "end": 219},
        {"name": "Process Automation", "slug": "process-automation", "start": 220, "end": 230},
        {"name": "Business Process Management", "slug": "business-process-management", "start": 231, "end": 240}
    ]

    services_data = {}

    for s in service_pages:
        name = s["name"]
        slug = s["slug"]
        start_idx = s["start"]
        end_idx = s["end"]

        s_text_pages = pages[start_idx : end_idx + 1]
        full_text = "\n".join(s_text_pages)

        # Parse Tagline and Intro:
        first_page = s_text_pages[0]
        lines_first_page = [l.strip() for l in first_page.split('\n') if l.strip()]

        tagline = ""
        intro = []
        
        # Skip "Next service:" labels if present at the top
        start_line_idx = 0
        if lines_first_page and "next service:" in lines_first_page[0].lower():
            start_line_idx += 2

        if len(lines_first_page) > start_line_idx:
            # First line is title
            if len(lines_first_page) > start_line_idx + 1:
                tagline = clean_text(lines_first_page[start_line_idx + 1])
                for line in lines_first_page[start_line_idx + 2:]:
                    if "challenges" in line.lower() or "solve" in line.lower() or "portfolio" in line.lower():
                        break
                    intro.append(clean_text(line))
        
        intro_paragraph = " ".join(intro) if intro else ""

        # Extract Challenges:
        challenges = []
        bullet_pattern = re.compile(r'^[•\-\*]\s*(.*)$')
        
        challenges_started = False
        for p_idx in range(min(3, len(s_text_pages))):
            p_text = s_text_pages[p_idx]
            for line in p_text.split('\n'):
                line = line.strip()
                if "challenges" in line.lower() or "commonly face" in line.lower() or "solve" in line.lower():
                    challenges_started = True
                    continue
                if challenges_started:
                    match = bullet_pattern.match(line)
                    if match:
                        bullet_text = clean_text(match.group(1))
                        if "deliverables" in bullet_text.lower() or "methodology" in bullet_text.lower():
                            break
                        if bullet_text and bullet_text not in challenges:
                            challenges.append(bullet_text)
                    elif line and not line.startswith(('•', '-', '*')) and challenges:
                        break

        challenges = challenges[:5]
        if not challenges:
            challenges = [
                "Poor scalability",
                "High operational costs",
                "Process bottlenecks",
                "Security vulnerabilities",
                "Limited visibility"
            ]

        # Extract Offerings:
        offerings = []
        all_service_lines = [l.strip() for l in full_text.split('\n') if l.strip()]
        
        for idx, line in enumerate(all_service_lines):
            is_title = (
                not line.startswith(('•', '-', '*', 'Phase', 'Engagement', 'Why Choose', 'FAQs', 'Business', 'Organizations', 'We build', 'Our'))
                and len(line) < 60
                and any(keyword in line for keyword in ["Development", "Integration", "Solutions", "Analytics", "Security", "Management", "Testing", "Transformation", "Audit", "Automation", "Strategy", "Consulting", "Workplace", "Systems", "Engine", "Operations", "Governance"])
            )
            
            if is_title:
                found_section = False
                section_idx = -1
                for j in range(1, 5):
                    if idx + j < len(all_service_lines):
                        next_l = all_service_lines[idx + j].lower()
                        if any(k in next_l for k in ["deliverables", "applications", "use cases", "objectives", "benefits"]):
                            found_section = True
                            section_idx = idx + j
                            break
                
                if found_section:
                    offering_title = clean_text(line)
                    desc_lines = all_service_lines[idx + 1 : section_idx]
                    offering_desc = " ".join(desc_lines) if desc_lines else "Optimize workflows and improve operational flow."
                    offering_desc = clean_text(offering_desc)

                    offering_delivs = []
                    deliv_search_idx = section_idx + 1
                    while deliv_search_idx < len(all_service_lines):
                        next_line = all_service_lines[deliv_search_idx]
                        if next_line.startswith(('•', '-', '*')):
                            match = bullet_pattern.match(next_line)
                            if match:
                                offering_delivs.append(clean_text(match.group(1)))
                        elif next_line.endswith(':') or "Phase" in next_line or "engagement" in next_line.lower() or (len(next_line) < 30 and not next_line.startswith(('•', '-', '*'))):
                            break
                        deliv_search_idx += 1

                    if offering_delivs and offering_title not in [o["title"] for o in offerings]:
                        offerings.append({
                            "title": offering_title,
                            "description": offering_desc,
                            "deliverables": offering_delivs[:6]
                        })

        offerings = offerings[:6]

        if len(offerings) < 3:
            print(f"Offering extraction for {name} was low ({len(offerings)}). Adding robust default items.")
            default_items = [
                {
                    "title": f"{name} Strategy & Roadmap",
                    "description": f"Develop structured {name} adoption roadmaps aligned with business objectives.",
                    "deliverables": [
                        "Readiness assessments",
                        "Transformation roadmap",
                        "Cost-benefit analysis",
                        "Security impact assessments",
                        "Governance frameworks"
                    ]
                },
                {
                    "title": f"Core {name} Implementation",
                    "description": f"Deploy secure, reliable, and high-performance {name} solutions.",
                    "deliverables": [
                        "Architecture setup",
                        "Integration blueprints",
                        "Performance benchmarks",
                        "System validation",
                        "Employee onboarding plans"
                    ]
                },
                {
                    "title": f"Security & Compliance Audit",
                    "description": f"Protect your {name} systems and ensure compliance with global standards.",
                    "deliverables": [
                        "Security audit reports",
                        "Compliance checklists",
                        "Threat modeling assessments",
                        "Vulnerability fixes",
                        "Access control policies"
                    ]
                },
                {
                    "title": f"Continuous Performance Optimization",
                    "description": f"Maintain peak operational efficiency and reduce costs through constant monitoring.",
                    "deliverables": [
                        "Real-time monitoring dashboards",
                        "Cost tuning recommendations",
                        "SLA and response planning",
                        "Resource scaling policies",
                        "Optimization roadmaps"
                    ]
                }
            ]
            for item in default_items:
                if len(offerings) < 6 and item["title"] not in [o["title"] for o in offerings]:
                    offerings.append(item)

        services_data[slug] = {
            "name": name,
            "slug": slug,
            "tagline": tagline or f"Build Scalable, Secure, and Future Ready {name} Solutions",
            "description": intro_paragraph or f"Modern organizations require {name} solutions that can scale rapidly, remain secure, optimize costs, and support digital transformation initiatives.",
            "challenges": challenges,
            "offerings": offerings
        }

    # Write to a JSON file
    os.makedirs('src/data', exist_ok=True)
    with open('src/data/services_data.json', 'w', encoding='utf-8') as f:
        json.dump(services_data, f, indent=2, ensure_ascii=False)
    
    print("Services JSON built successfully with", len(services_data), "services!")
    for slug, s in services_data.items():
        print(f" - {slug}: {len(s['challenges'])} challenges, {len(s['offerings'])} offerings")

if __name__ == '__main__':
    main()
