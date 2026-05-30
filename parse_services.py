import re

def main():
    with open('services_extracted.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    pages = re.split(r'--- PAGE \d+ ---', text)
    print(f"Total pages: {len(pages)}")

    with open('pdf_directory.txt', 'w', encoding='utf-8') as out:
        for idx, page in enumerate(pages):
            lines = [line.strip() for line in page.split('\n') if line.strip()]
            if lines:
                first_line = lines[0]
                second_line = lines[1] if len(lines) > 1 else ""
                out.write(f"Page {idx}: {first_line} | {second_line}\n")
    
    print("PDF Directory written to pdf_directory.txt!")

if __name__ == '__main__':
    main()
