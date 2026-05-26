import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'reports.json');
const reportsDir = path.join(process.cwd(), 'public', 'assets', 'reports');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading reports:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;
    
    // Read current data
    let reports = [];
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      reports = JSON.parse(data);
    } catch (e) {
      reports = [];
    }

    if (action === 'delete') {
      const id = formData.get('id') as string;
      reports = reports.filter((r: any) => r.id !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(reports, null, 2));
      return NextResponse.json({ success: true, reports });
    }

    if (action === 'add' || action === 'update') {
      const title = formData.get('title') as string;
      const file = formData.get('file') as File | null;
      let id = formData.get('id') as string;
      
      if (action === 'add') {
        id = Date.now().toString();
      }

      let pdfUrl = formData.get('pdfUrl') as string || '';

      if (file && file.size > 0) {
        // Ensure reports directory exists
        try {
          await fs.mkdir(reportsDir, { recursive: true });
        } catch (e) {}

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `report-${id}.pdf`;
        const filePath = path.join(reportsDir, fileName);
        await fs.writeFile(filePath, buffer);
        pdfUrl = `/assets/reports/${fileName}`;
      }

      if (action === 'add') {
        reports.push({ id, title, pdfUrl });
      } else {
        const index = reports.findIndex((r: any) => r.id === id);
        if (index > -1) {
          reports[index] = { ...reports[index], title, pdfUrl };
        }
      }

      await fs.writeFile(dataFilePath, JSON.stringify(reports, null, 2));
      return NextResponse.json({ success: true, reports });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error in financial-reports API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
