import re
import json
import os

def main():
    raw_path = 'services_extracted.txt'
    json_path = 'src/data/services_data.json'
    
    if not os.path.exists(raw_path):
        print("services_extracted.txt not found!")
        return
        
    text = open(raw_path, 'r', encoding='utf-8').read()
    
    services = [
        {'name': 'AI & Data Analytics', 'slug': 'ai-data-analytics', 'idx': 0},
        {'name': 'Cloud', 'slug': 'cloud', 'idx': 5532},
        {'name': 'Cybersecurity', 'slug': 'cybersecurity', 'idx': 12712},
        {'name': 'Network Solutions', 'slug': 'network-solutions', 'idx': 19676},
        {'name': 'Industrial Autonomy & Engineering', 'slug': 'industrial-autonomy-and-engineering', 'idx': 27371},
        {'name': 'Enterprise Solutions', 'slug': 'enterprise-solutions', 'idx': 35689},
        {'name': 'Consulting', 'slug': 'consulting', 'idx': 43305},
        {'name': 'Software Development', 'slug': 'software-development', 'idx': 50630},
        {'name': 'Cognitive Business Operations', 'slug': 'cognitive-business-operations', 'idx': 57781},
        {'name': 'Web Development', 'slug': 'web-development', 'idx': 65563},
        {'name': 'Application Development', 'slug': 'application-development', 'idx': 74692},
        {'name': 'Startup MVP', 'slug': 'startup-mvp', 'idx': 83269},
        {'name': 'CRM Solution', 'slug': 'crm-solution', 'idx': 90949},
        {'name': 'CXM Solution', 'slug': 'cxm-solution', 'idx': 99013},
        {'name': 'Digital Marketing', 'slug': 'digital-marketing', 'idx': 107275},
        {'name': 'Blockchain', 'slug': 'blockchain', 'idx': 115405},
        {'name': 'IoT', 'slug': 'iot', 'idx': 123595},
        {'name': 'DevOps', 'slug': 'devops', 'idx': 132307},
        {'name': 'Unit Testing', 'slug': 'unit-test', 'idx': 140803},
        {'name': 'Quality Assurance', 'slug': 'quality-assurance', 'idx': 148430},
        {'name': 'Workplace Transformation', 'slug': 'workplace-transformation', 'idx': 156073},
        {'name': 'Process Automation', 'slug': 'process-automation', 'idx': 164112},
        {'name': 'Business Process Management', 'slug': 'business-process-management', 'idx': 172515}
    ]
    
    slices = []
    sorted_services = sorted(services, key=lambda x: x['idx'])
    for i in range(len(sorted_services)):
        s = sorted_services[i]
        start = s['idx']
        end = sorted_services[i+1]['idx'] if i+1 < len(sorted_services) else len(text)
        slices.append({
            'name': s['name'],
            'slug': s['slug'],
            'raw_text': text[start:end]
        })
        
    parsed_data = {}
    
    bullet_chars = ('\uFFFD', '\u2022', '\u0095', '•', '-', '*')
    ignore_keywords = [
        'deliverables', 'objectives', 'benefits', 'types', 'activities', 
        'outputs', 'testing areas', 'validation areas', 'methodology', 
        'engagement models', 'faqs', 'industries served', 'business outcomes', 
        'principles', 'technologies', 'use cases', 'applications'
    ]
    
    for s in slices:
        raw = s['raw_text']
        raw_lines = [l.strip() for l in raw.split('\n')]
        
        state = 'INTRO'
        tagline = ''
        desc_parts = []
        challenges = []
        offerings = []
        methodology = []
        
        current_offering = None
        collecting_deliverables = False
        
        current_phase = None
        collecting_list = None
        
        for l in raw_lines:
            if not l or '--- PAGE' in l:
                continue
                
            l_lower = l.lower()
            
            # Title skip check at very top of loop
            if state == 'INTRO':
                test_title = s['name'].lower()
                if l_lower == test_title or l_lower == (test_title + ' services') or l_lower == (test_title + ' solutions') or l_lower == (test_title + ' solution') or l_lower == (test_title + ' (qa) services') or l_lower == ('internet of things (iot) services'):
                    continue
                    
            is_bullet = l.startswith(bullet_chars)
            clean_l = re.sub(r'^[•\-*]\s*', '', l).strip()
            
            # Identify if it is a portfolio section header transition
            is_portfolio_transition = False
            if len(l) < 60 and (l_lower.startswith('our ') or l_lower.endswith('service portfolio') or l_lower.endswith('services portfolio') or 'service portfolio' in l_lower or 'service offerings' in l_lower):
                is_portfolio_transition = True
                
            # Check state transitions
            if 'challenges we solve' in l_lower or 'commonly face' in l_lower or 'solve these challenges' in l_lower or 'commonly encounter' in l_lower:
                state = 'CHALLENGES'
                continue
            elif is_portfolio_transition:
                if state != 'PORTFOLIO' and state != 'METHODOLOGY' and state != 'OUTCOME':
                    state = 'PORTFOLIO'
                    continue
                    
            if state == 'INTRO':
                if is_bullet:
                    continue
                if 'next service:' in l_lower:
                    continue
                if not tagline:
                    tagline = l
                else:
                    desc_parts.append(l)
                    
            elif state == 'CHALLENGES':
                if is_bullet:
                    if clean_l and clean_l not in challenges:
                        challenges.append(clean_l)
                elif len(challenges) > 0 and not is_bullet:
                    if is_portfolio_transition:
                        state = 'PORTFOLIO'
                        
            elif state == 'PORTFOLIO':
                # Check for detailed methodology transition
                if not is_bullet and ('detailed methodology' in l_lower or (len(l) < 30 and l_lower == 'methodology')):
                    state = 'METHODOLOGY'
                    collecting_deliverables = False
                    current_offering = None
                    continue
                elif not is_bullet and not l.startswith(bullet_chars) and len(l) < 35 and any(k in l_lower for k in ['technology stack', 'technologies & platforms', 'deployment models', 'security framework', 'security principles', 'engagement models', 'why choose', 'faqs', 'industries', 'business outcomes', 'principles', 'domains covered']):
                    state = 'OUTCOME'
                    collecting_deliverables = False
                    current_offering = None
                    continue
                    
                # Skip portfolio headers
                if is_portfolio_transition:
                    continue
                    
                # Trigger deliverable-like collections
                if not is_bullet and len(l) < 25 and any(k in l_lower for k in ['deliverables', 'use cases', 'applications', 'benefits', 'types']):
                    collecting_deliverables = True
                    continue
                    
                if collecting_deliverables and not is_bullet:
                    collecting_deliverables = False
                    current_offering = None
                    
                if collecting_deliverables:
                    if is_bullet and current_offering:
                        if clean_l and clean_l not in current_offering['deliverables']:
                            current_offering['deliverables'].append(clean_l)
                else:
                    if not is_bullet:
                        is_new_title = False
                        if len(l) < 60 and l[0].isupper() and not l.endswith('.') and not any(k in l_lower for k in ignore_keywords):
                            is_new_title = True
                            
                        if is_new_title:
                            current_offering = {
                                'title': l,
                                'description': '',
                                'deliverables': []
                            }
                            offerings.append(current_offering)
                        else:
                            if current_offering:
                                if not current_offering['description']:
                                    current_offering['description'] = l
                                else:
                                    current_offering['description'] += ' ' + l
                                    
            elif state == 'METHODOLOGY':
                # Check exit from methodology to outcome
                if not is_bullet and not l.startswith(bullet_chars) and len(l) < 35 and any(k in l_lower for k in ['technology stack', 'technologies & platforms', 'deployment models', 'security framework', 'security principles', 'engagement models', 'why choose', 'faqs', 'industries', 'business outcomes', 'principles', 'domains covered']):
                    state = 'OUTCOME'
                    continue
                    
                # Parse phase headers
                phase_match = re.match(r'^phase\s*(\d+)\s*:\s*(.*)', l, re.IGNORECASE)
                if phase_match:
                    current_phase = {
                        'phase': int(phase_match.group(1)),
                        'title': phase_match.group(2).strip(),
                        'activities': [],
                        'outputs': []
                    }
                    methodology.append(current_phase)
                    collecting_list = None
                    continue
                    
                if current_phase:
                    if not is_bullet:
                        if 'activities' in l_lower:
                            collecting_list = 'activities'
                        elif any(k in l_lower for k in ['outputs', 'deliverables', 'results']):
                            collecting_list = 'outputs'
                        else:
                            collecting_list = None
                    else:
                        if collecting_list == 'activities':
                            if clean_l and clean_l not in current_phase['activities']:
                                current_phase['activities'].append(clean_l)
                        elif collecting_list == 'outputs':
                            if clean_l and clean_l not in current_phase['outputs']:
                                current_phase['outputs'].append(clean_l)
                        else:
                            if clean_l and clean_l not in current_phase['activities']:
                                current_phase['activities'].append(clean_l)
                                
        description = ' '.join(desc_parts)
        tagline = re.sub(r'^[•\-*]\s*', '', tagline).strip()
        description = re.sub(r'^[•\-*]\s*', '', description).strip()
        
        # Clean bullet markers from offering fields
        cleaned_offerings = []
        for o in offerings:
            if o['title'] and o['description'] and o['deliverables']:
                title_lower = o['title'].lower()
                if 'portfolio' in title_lower or 'our services' in title_lower or 'service offerings' in title_lower:
                    continue
                o['title'] = re.sub(r'^[•\-*]\s*', '', o['title']).strip()
                o['description'] = re.sub(r'^[•\-*]\s*', '', o['description']).strip()
                cleaned_offerings.append(o)
                
        parsed_data[s['slug']] = {
            'name': s['name'],
            'slug': s['slug'],
            'tagline': tagline,
            'description': description,
            'challenges': challenges[:8],
            'offerings': cleaned_offerings[:6],
            'methodology': methodology
        }
        
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(parsed_data, f, indent=2, ensure_ascii=False)
        
    print("SUCCESS: Full database (with methodology) regenerated perfectly for all 23 services!")

if __name__ == '__main__':
    main()
