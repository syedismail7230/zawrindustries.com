import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'press-releases.json');
const pressDir = path.join(process.cwd(), 'public', 'assets', 'press-releases');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading press releases:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;
    
    // Read current data
    let releases = [];
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      releases = JSON.parse(data);
    } catch (e) {
      releases = [];
    }

    if (action === 'delete') {
      const id = formData.get('id') as string;
      releases = releases.filter((r: any) => r.id !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(releases, null, 2));
      return NextResponse.json({ success: true, releases });
    }

    if (action === 'add' || action === 'update') {
      const title = formData.get('title') as string;
      const category = formData.get('category') as string || 'General';
      const date = formData.get('date') as string;
      const summary = formData.get('summary') as string || '';
      const body = formData.get('body') as string || '';
      const archived = formData.get('archived') === 'true';
      const linksJson = formData.get('links') as string || '[]';
      const attachmentsJson = formData.get('attachments') as string || '[]';
      
      let id = formData.get('id') as string;
      if (action === 'add') {
        id = `PR-${Date.now()}`;
      }

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Parse existing links and attachments
      const links = JSON.parse(linksJson);
      let attachments = JSON.parse(attachmentsJson);

      // Handle file upload if any
      const file = formData.get('file') as File | null;
      const fileLabel = formData.get('fileLabel') as string || 'Document Attachment';

      if (file && file.size > 0) {
        // Ensure press directory exists
        try {
          await fs.mkdir(pressDir, { recursive: true });
        } catch (e) {}

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `press-${id}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(pressDir, fileName);
        await fs.writeFile(filePath, buffer);
        const fileUrl = `/assets/press-releases/${fileName}`;

        // Append to attachments
        attachments.push({ label: fileLabel, url: fileUrl });
      }

      // Handle banner image upload if any
      const bannerFile = formData.get('bannerFile') as File | null;
      let banner = formData.get('existingBanner') as string || '/assets/public-relations-hero.png';

      if (bannerFile && bannerFile.size > 0) {
        // Ensure press directory exists
        try {
          await fs.mkdir(pressDir, { recursive: true });
        } catch (e) {}

        const buffer = Buffer.from(await bannerFile.arrayBuffer());
        const fileName = `banner-${id}-${bannerFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(pressDir, fileName);
        await fs.writeFile(filePath, buffer);
        banner = `/assets/press-releases/${fileName}`;
      } else if (action === 'update') {
        const index = releases.findIndex((r: any) => r.id === id);
        if (index > -1 && releases[index].banner) {
          banner = releases[index].banner;
        }
      }

      const releaseData = {
        id,
        slug,
        title,
        date,
        category,
        summary,
        body,
        attachments,
        links,
        archived,
        banner
      };

      if (action === 'add') {
        releases.push(releaseData);
      } else {
        const index = releases.findIndex((r: any) => r.id === id);
        if (index > -1) {
          releases[index] = { ...releases[index], ...releaseData };
        }
      }

      // Sort: newest first (using ID or date, here ID is timestamp-based for added PRs)
      releases.sort((a: any, b: any) => b.id.localeCompare(a.id));

      await fs.writeFile(dataFilePath, JSON.stringify(releases, null, 2));
      return NextResponse.json({ success: true, releases });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error in press releases API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
