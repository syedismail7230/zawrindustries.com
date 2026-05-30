import json
import os

def main():
    json_path = 'src/data/services_data.json'
    if not os.path.exists(json_path):
        print("services_data.json not found!")
        return
        
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # Mapping of surgical corrections for all glitched services
    corrections = {
        "network-solutions": {
            "tagline": "Build Reliable, Secure, and High-Performance Network Infrastructure",
            "description": "Modern enterprises require networking environments capable of supporting growing workloads, distributed teams, digital applications, connected devices, and mission-critical operations. Our Network Solutions services focus on designing, implementing, optimizing, and managing enterprise-grade network ecosystems that deliver reliability, scalability, security, and operational efficiency. We help organizations build communication infrastructure that supports business growth while maintaining security, compliance, and performance.",
            "challenges": [
                "Frequent downtime",
                "Slow communication systems",
                "Poor scalability",
                "Security vulnerabilities",
                "Inefficient bandwidth utilization",
                "Limited network visibility",
                "Difficulty supporting remote work",
                "High network management costs"
            ]
        },
        "industrial-autonomy-and-engineering": {
            "tagline": "Accelerate Industrial Transformation Through Intelligent Automation and Engineering Systems",
            "description": "Industrial environments are rapidly evolving toward connected, autonomous, and highly efficient ecosystems. Organizations require advanced engineering systems capable of improving operational efficiency, reducing manual intervention, increasing productivity, and enabling real-time decision-making. Our Industrial Autonomy & Engineering services focus on designing, developing, integrating, and optimizing intelligent industrial systems that combine automation, control logic, data engineering, and modern operational frameworks.",
            "challenges": [
                "Slow decision-making processes",
                "Poor machine connectivity",
                "Safety concerns",
                "Resource wastage",
                "Limited scalability of production systems",
                "High operational costs",
                "Frequent equipment failures",
                "Difficulty integrating legacy systems"
            ]
        },
        "enterprise-solutions": {
            "tagline": "Enable Enterprise-Wide Digital Transformation Through Integrated Business Systems",
            "description": "Modern enterprises operate in highly competitive environments requiring seamless connectivity, real-time data visibility, efficient workflows, and integrated operations. Our Enterprise Solutions services focus on designing, implementing, optimizing, and managing enterprise-grade business systems that connect workflows, departments, data sources, and business operations to drive productivity and growth.",
            "challenges": [
                "Lack of process visibility",
                "Operational inefficiencies",
                "Data silos",
                "Poor collaboration between teams",
                "Limited scalability",
                "Inconsistent workflows",
                "High administrative costs",
                "Difficulty tracking performance metrics"
            ]
        },
        "consulting": {
            "tagline": "Drive Business Transformation Through Strategic Technology and Operational Advisory",
            "description": "Organizations operating in rapidly changing markets require structured decision-making frameworks, technology alignment strategies, operational excellence programs, and change management capabilities. Our Consulting services focus on delivering high-impact strategic advisory, transformation roadmaps, change enablement programs, and operational governance models that support long-term business goals.",
            "challenges": [
                "Slow technology adoption",
                "Misalignment between IT and business strategy",
                "Poor operational visibility",
                "High organizational resistance to change",
                "Inefficient governance frameworks",
                "Difficulty managing complex projects",
                "Lack of structured innovation roadmap"
            ]
        },
        "software-development": {
            "tagline": "Build Scalable, Secure, and High-Performance Software Solutions for Modern Businesses",
            "description": "Organizations require software systems that improve efficiency, accelerate growth, streamline operations, and create competitive advantages. Our Software Development Services focus on designing, engineering, deploying, and maintaining software products tailored to specific enterprise needs, ensuring robust security, high reliability, and seamless integration.",
            "challenges": [
                "Inefficient manual processes",
                "Legacy systems limiting growth",
                "Poor system scalability",
                "Fragmented operational workflows",
                "Long development cycles",
                "High maintenance costs",
                "Security vulnerabilities in legacy software"
            ]
        },
        "cognitive-business-operations": {
            "tagline": "Transform Operations Through Intelligent, Data-Driven, and Automated Business Processes",
            "description": "Modern enterprises require operational ecosystems that are agile, intelligent, scalable, and responsive to market dynamics. Our Cognitive Business Operations Services focus on helping organizations reduce operational complexity, improve service delivery, and enable intelligent business operations through structured transformation initiatives, predictive analysis, and intelligent optimization frameworks.",
            "challenges": [
                "Manual and repetitive workflows",
                "Operational inefficiencies",
                "Slow decision-making cycles",
                "High process costs",
                "Limited visibility into operations",
                "Customer dissatisfaction from service delays",
                "Siloed operations across departments"
            ]
        },
        "application-development": {
            "tagline": "Build Intelligent, Scalable, and User-Centric Applications for Modern Businesses",
            "description": "Organizations require applications that improve customer experiences, optimize operations, support business growth, and enable digital transformation. Our Application Development Services focus on designing, engineering, deploying, and maintaining applications that are scalable, secure, reliable, and aligned with business objectives. We build applications ranging from consumer-facing mobile apps and enterprise applications to business productivity platforms and large-scale multi-user ecosystems.",
            "challenges": [
                "Poor customer experiences",
                "Legacy applications limiting growth",
                "Slow operational workflows",
                "Low application scalability",
                "Security concerns",
                "Limited cross-platform accessibility",
                "High maintenance costs",
                "Poor performance under scale",
                "Fragmented user experiences",
                "Difficulty integrating applications with existing systems"
            ],
            "offerings": [
                {
                    "title": "Mobile Application Development",
                    "description": "Develop applications for mobile users across multiple device ecosystems.",
                    "deliverables": [
                        "Native mobile applications",
                        "Hybrid applications",
                        "Cross-platform applications",
                        "Consumer-facing apps",
                        "Enterprise mobility solutions"
                    ]
                },
                {
                    "title": "Enterprise Application Development",
                    "description": "Develop business applications supporting enterprise operations.",
                    "deliverables": [
                        "Internal applications",
                        "Operational platforms",
                        "Workflow systems",
                        "Employee productivity applications",
                        "Management applications"
                    ]
                },
                {
                    "title": "Cross-Platform Application Development",
                    "description": "Develop applications capable of operating across multiple environments.",
                    "deliverables": [
                        "Shared codebase applications",
                        "Multi-device experiences",
                        "Unified application ecosystems"
                    ]
                },
                {
                    "title": "Business Application Development",
                    "description": "Develop applications supporting business operations and workflows.",
                    "deliverables": [
                        "Management applications",
                        "Tracking systems",
                        "Workflow applications",
                        "Business productivity systems"
                    ]
                },
                {
                    "title": "Application Modernization",
                    "description": "Upgrade existing applications to support growth and improved performance.",
                    "deliverables": [
                        "Application refactoring",
                        "Technology upgrades",
                        "User experience improvements",
                        "Performance enhancements"
                    ]
                }
            ]
        },
        "crm-solution": {
            "tagline": "Build Stronger Customer Relationships Through Centralized Customer Management Systems",
            "description": "Organizations require integrated systems to manage customer data, track interactions, automate workflows, and drive customer satisfaction. Our CRM Solutions services focus on designing, implementing, customizing, and optimizing enterprise-grade customer relationship management systems that connect sales, marketing, customer support, and business operations.",
            "challenges": [
                "Inconsistent customer communication",
                "Limited sales visibility",
                "Manual customer management processes",
                "Poor customer retention",
                "Inefficient follow-ups",
                "Lack of centralized customer data",
                "Difficulty forecasting sales pipelines",
                "Poor alignment between sales and marketing"
            ]
        },
        "cxm-solution": {
            "tagline": "Deliver Seamless, Personalized, and Connected Customer Experiences Across Every Touchpoint",
            "description": "Modern organizations must deliver exceptional customer experiences across multiple channels to drive brand loyalty and customer retention. Our CXM Solutions services focus on establishing structured experience management frameworks, customer journey optimization systems, automated feedback loops, and intelligent engagement systems that align business operations with customer expectations.",
            "challenges": [
                "Disconnected communication channels",
                "Poor customer feedback mechanisms",
                "High churn rates",
                "Limited personalization capabilities",
                "Difficulty measuring customer satisfaction",
                "Inconsistent service quality",
                "Siloed customer interaction data",
                "Delayed customer issue resolution"
            ]
        },
        "blockchain": {
            "tagline": "Build Secure, Transparent, and Decentralized Digital Ecosystems",
            "description": "Organizations increasingly require systems that provide transparency, trust, security, traceability, and decentralized control across business processes. Our Blockchain services focus on designing, engineering, deploying, and maintaining decentralized applications, smart contracts, asset tokenization frameworks, and secure distributed ledger networks.",
            "challenges": [
                "Lack of transactional transparency",
                "High operational risk in multi-party transactions",
                "Security vulnerabilities in centralized ledgers",
                "Difficulty tracing supply chain assets",
                "High cost of trust verification",
                "Siloed records across organizations"
            ]
        },
        "iot": {
            "tagline": "Build Intelligent, Connected, and Scalable IoT Ecosystems for Real-Time Operational Visibility",
            "description": "Modern organizations require systems that connect physical operations with digital environments to drive efficiency and enable predictive decision-making. Our IoT Services focus on designing, implementing, and managing connected ecosystems that enable communication between devices, infrastructure, sensors, systems, and business applications. We build IoT ecosystems that transform physical data into measurable business outcomes.",
            "challenges": [
                "Limited operational visibility",
                "Disconnected devices and systems",
                "Manual monitoring processes",
                "Delayed decision-making",
                "Inefficient asset utilization",
                "Security risks in connected devices",
                "High maintenance costs for distributed assets"
            ]
        },
        "devops": {
            "tagline": "Accelerate Software Delivery Through Automation, Reliability, and Continuous Operations",
            "description": "Modern software development requires collaboration, speed, continuous integration, robust automated testing, and reliable environment delivery to maintain business agility. Our DevOps services focus on building integrated software delivery pipelines, automated infrastructure environments, robust monitoring, and continuous deployment systems that enable rapid, stable, and high-quality software releases.",
            "challenges": [
                "Difficult scaling processes",
                "Unstable environments",
                "Long recovery times during failures",
                "Frequent deployment failures",
                "Poor collaboration between teams",
                "Manual deployment processes",
                "Limited performance visibility",
                "High operations overhead"
            ]
        },
        "workplace-transformation": {
            "tagline": "Modernize Workforce Experiences, Improve Collaboration, and Build Future-Ready Work Environments",
            "description": "Organizations are evolving rapidly with hybrid work models, distributed teams, digital workplaces, and changing employee expectations. Our Workplace Transformation Services focus on designing, implementing, and managing modern digital ecosystems that improve collaboration, increase workforce productivity, simplify communication, and ensure robust security across endpoints.",
            "challenges": [
                "Fragmented workplace systems",
                "Poor employee collaboration",
                "Low workforce productivity",
                "Inefficient communication channels",
                "Difficulty supporting remote work",
                "Security risks in remote endpoints",
                "Complex application access management"
            ]
        },
        "process-automation": {
            "tagline": "Streamline Operations, Reduce Manual Effort, and Improve Efficiency Through Intelligent Process Automation",
            "description": "Organizations face increasing pressure to improve operational efficiency, reduce costs, eliminate errors, and accelerate service delivery. Our Process Automation services focus on designing, implementing, and optimizing automated workflows, RPA bots, system integrations, and cognitive workflows that handle repetitive tasks and support enterprise workflows.",
            "challenges": [
                "Slow business processes",
                "Human errors in workflows",
                "Inconsistent process execution",
                "Poor operational visibility",
                "Delayed approvals",
                "Resource wastage",
                "Difficulty managing scaling demands",
                "High process execution costs"
            ]
        },
        "business-process-management": {
            "tagline": "Standardize, Monitor, and Optimize Business Workflows for Sustainable Operational Growth",
            "description": "Modern organizations require Business Process Management solutions that can scale rapidly, remain secure, optimize costs, and support digital transformation initiatives. Our Business Process Management Services help organizations standardize workflows, improve operational visibility, reduce inefficiencies, strengthen governance, and create sustainable process ecosystems that continuously improve over time.",
            "challenges": [
                "Limited scalability of operations",
                "Inefficient manual processes",
                "Poor workflow visibility",
                "Process bottlenecks",
                "Lack of process standardization",
                "Difficult regulatory compliance",
                "Data fragmentation across tools",
                "Siloed team communication"
            ]
        }
    }
    
    # Apply corrections
    for slug, corr in corrections.items():
        if slug in data:
            data[slug]["tagline"] = corr["tagline"]
            data[slug]["description"] = corr["description"]
            data[slug]["challenges"] = corr["challenges"]
            if "offerings" in corr:
                data[slug]["offerings"] = corr["offerings"]
            print(f"Corrected: {slug}")
            
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print("Pruned and repaired JSON file successfully!")

if __name__ == '__main__':
    main()
