import json

# Map industry name → image filename in /assets/industry/
IMG = {
    "Automotive":           "automotive-industry.png",
    "Manufacturing":        "manufacturing-industry.png",
    "Healthcare":           "healthcare-industry.png",
    "Retail":               "retail-industry.png",
    "Logistics":            "logistics-industry.png",
    "Education":            "education-industry.png",
    "Banking":              "banking-industry.png",
    "Smart Mobility":       "smart-city-industry.png",
    "Financial Services":   "financial-services-industry.png",
    "Government":           "government-industry.png",
    "Telecom":              "telecom-industry.png",
    "Warehousing":          "supplychain-industry.png",
    "Agriculture":          "agricultue-industry.png",   # typo in actual file
    "Energy":               "energy-industry.png",
    "Mining":               "manufacturing-industry.png",
    "Smart Infrastructure": "smart-city-industry.png",
    "Startups":             "startups-industry.png",
    "Finance":              "financial-services-industry.png",
    "FinTech":              "financial-services-industry.png",
    "Mobility":             "automotive-industry.png",
    "Consumer Products":    "retail-industry.png",
    "SaaS":                 "saas-industry.png",
    "Professional Services":"professional-industry.png",
    "Hospitality":          "hospitality-industry.png",
    "E-Commerce":           "e-commerce-industry.png",
    "Real Estate":          "professional-industry.png",
    "Supply Chain":         "supplychain-industry.png",
    "Technology":           "technology-industry.png",
    "Smart Cities":         "smart-city-industry.png",
}

def ind(names):
    return [{"name": n, "image": f"/assets/industry/{IMG[n]}"} for n in names]

INDUSTRIES = {
    "ai-data-analytics": ind([
        "Automotive","Manufacturing","Healthcare","Retail","Logistics","Education","Banking","Smart Mobility"
    ]),
    "cloud": ind([
        "Automotive","Healthcare","Retail","Manufacturing","Logistics","Financial Services","Education","Government"
    ]),
    "cognitive-business-operations": ind([
        "Banking","Healthcare","Manufacturing","Automotive","Retail","Logistics","Telecom","Education"
    ]),
    "cybersecurity": ind([
        "Financial Services","Healthcare","Manufacturing","Automotive","Retail","Government","Education","Logistics"
    ]),
    "network-solutions": ind([
        "Manufacturing","Automotive","Healthcare","Retail","Logistics","Education","Financial Services","Government"
    ]),
    "industrial-autonomy-and-engineering": ind([
        "Manufacturing","Automotive","Warehousing","Agriculture","Energy","Logistics","Mining","Smart Infrastructure"
    ]),
    "enterprise-solutions": ind([
        "Manufacturing","Automotive","Retail","Healthcare","Logistics","Education","Financial Services","Government"
    ]),
    "consulting": ind([
        "Automotive","Manufacturing","Healthcare","Logistics","Retail","Education","Financial Services","Startups"
    ]),
    "software-development": ind([
        "Automotive","Manufacturing","Healthcare","Education","Retail","Logistics","Finance","Startups"
    ]),
    "web-development": ind([
        "Automotive","Healthcare","Manufacturing","Education","Retail","Logistics","Financial Services","Startups"
    ]),
    "application-development": ind([
        "Healthcare","Automotive","Retail","Logistics","Manufacturing","Education","Financial Services","Startups"
    ]),
    "startup-mvp": ind([
        "FinTech","Mobility","Healthcare","Education","Retail","SaaS","Logistics","Consumer Products"
    ]),
    "crm-solution": ind([
        "Retail","Automotive","Healthcare","Logistics","Manufacturing","Education","Financial Services","Professional Services"
    ]),
    "cxm-solution": ind([
        "Retail","Automotive","Healthcare","Education","Financial Services","Logistics","Hospitality","E-Commerce"
    ]),
    "digital-marketing": ind([
        "Retail","Automotive","Healthcare","Education","Real Estate","Hospitality","Logistics","Technology"
    ]),
    "blockchain": ind([
        "Financial Services","Supply Chain","Automotive","Healthcare","Manufacturing","Logistics","Retail","Government"
    ]),
    "iot": ind([
        "Manufacturing","Automotive","Agriculture","Healthcare","Logistics","Energy","Smart Cities","Retail"
    ]),
    "devops": ind([
        "Automotive","Healthcare","Manufacturing","Retail","Logistics","Financial Services","SaaS","Technology"
    ]),
    "unit-test": ind([
        "SaaS","Automotive","Healthcare","Retail","Manufacturing","Logistics","Education","Financial Services"
    ]),
    "quality-assurance": ind([
        "Automotive","Healthcare","Retail","Manufacturing","Logistics","Finance","Education","SaaS"
    ]),
    "workplace-transformation": ind([
        "Technology","Healthcare","Manufacturing","Automotive","Education","Retail","Financial Services","Logistics"
    ]),
    "process-automation": ind([
        "Manufacturing","Automotive","Retail","Healthcare","Logistics","Financial Services","Education","Professional Services"
    ]),
    "business-process-management": ind([
        "Manufacturing","Automotive","Retail","Healthcare","Logistics","Financial Services","Education","Professional Services"
    ]),
}

with open("src/data/services_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for slug, industries in INDUSTRIES.items():
    if slug in data:
        data[slug]["industries"] = industries
    else:
        print(f"WARNING: slug '{slug}' not found in JSON")

with open("src/data/services_data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Done — updated {len(INDUSTRIES)} services with industries data.")
