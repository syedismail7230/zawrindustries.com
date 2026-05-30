import re
import json

def main():
    with open('services_extracted.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    pages = re.split(r'--- PAGE \d+ ---', text)
    print("Total pages in PDF:", len(pages))

    services = [
        ('AI & Data Analytics', ['AI & Data Analytics']),
        ('Cloud', ['Cloud Services', 'Cloud']),
        ('Cybersecurity', ['Cybersecurity Services', 'Cybersecurity']),
        ('Network Solutions', ['Network Solutions']),
        ('Industrial Autonomy & Engineering', ['Industrial Autonomy & Engineering', 'Industrial Autonomy and Engineering']),
        ('Enterprise Solutions', ['Enterprise Solutions']),
        ('Consulting', ['Consulting Services', 'Consulting']),
        ('Software Development', ['Software Development Services', 'Software Development']),
        ('Web Development', ['Web Development Services', 'Web Development']),
        ('Application Development', ['Application Development Services', 'Application Development', 'Web Application Development']),
        ('Blockchain', ['Blockchain Services', 'Blockchain']),
        ('IoT', ['Internet of Things (IoT) Services', 'IoT Services', 'IoT']),
        ('DevOps', ['DevOps Services', 'DevOps']),
        ('CRM Solution', ['CRM Solutions', 'CRM Solution']),
        ('CXM Solution', ['CXM Solutions', 'CXM Solution']),
        ('Digital Marketing', ['Digital Marketing Services', 'Digital Marketing']),
        ('Unit Testing', ['Unit Testing Services', 'Unit Testing', 'Unit test']),
        ('Quality Assurance', ['Quality Assurance (QA) Services', 'Quality Assurance Services', 'Quality Assurance']),
        ('Workplace Transformation', ['Workplace Transformation Services', 'Workplace Transformation']),
        ('Process Automation', ['Process Automation Services', 'Process Automation']),
        ('Business Process Management', ['Business Process Management (BPM) Services', 'Business Process Management Services', 'Business Process Management', 'BPM Services']),
        ('Cognitive Business Operations', ['Cognitive Business Operations Services', 'Cognitive Business Operations'])
    ]

    found_starts = {}
    for p_idx, p in enumerate(pages):
        lines = [line.strip() for line in p.split('\n') if line.strip()]
        if not lines:
            continue
        header_text = ' '.join(lines[:5]).lower()
        for s_name, aliases in services:
            if s_name in found_starts:
                continue
            for alias in aliases:
                pattern = r'\b' + re.escape(alias.lower()) + r'\b'
                if re.search(pattern, header_text):
                    found_starts[s_name] = p_idx
                    break

    for s_name, p_idx in sorted(found_starts.items(), key=lambda x: x[1]):
        preview = pages[p_idx].strip().replace('\n', ' ')[:100]
        print(f'{s_name}: Page {p_idx} | Preview: "{preview}..."')

if __name__ == '__main__':
    main()
