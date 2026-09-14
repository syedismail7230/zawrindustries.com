import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyWebmasterAuth } from '@/lib/webmaster-security';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'notifications.json');
const notificationsDir = path.join(process.cwd(), 'public', 'assets', 'notifications');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading notifications:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const authCheck = await verifyWebmasterAuth(request, 'notifications', formData);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || 'Unauthorized' }, { status: 401 });
    }

    const action = formData.get('action') as string;
    
    // Read current data
    let notifications = [];
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      notifications = JSON.parse(data);
    } catch (e) {
      notifications = [];
    }

    if (action === 'delete') {
      const id = formData.get('id') as string;
      notifications = notifications.filter((n: any) => n.id !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(notifications, null, 2));
      return NextResponse.json({ success: true, notifications });
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
        id = `NOTIF-${Date.now()}`;
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
      const fileLabel = formData.get('fileLabel') as string || 'Notification Attachment';

      if (file && file.size > 0) {
        // Ensure notifications directory exists
        try {
          await fs.mkdir(notificationsDir, { recursive: true });
        } catch (e) {}

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `notification-${id}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(notificationsDir, fileName);
        await fs.writeFile(filePath, buffer);
        const fileUrl = `/assets/notifications/${fileName}`;

        // Append to attachments
        attachments.push({ label: fileLabel, url: fileUrl });
      }

      const notificationData = {
        id,
        slug,
        title,
        date,
        category,
        summary,
        body,
        attachments,
        links,
        archived
      };

      if (action === 'add') {
        notifications.push(notificationData);
      } else {
        const index = notifications.findIndex((n: any) => n.id === id);
        if (index > -1) {
          notifications[index] = { ...notifications[index], ...notificationData };
        }
      }

      // Sort: newest first
      notifications.sort((a: any, b: any) => b.id.localeCompare(a.id));

      await fs.writeFile(dataFilePath, JSON.stringify(notifications, null, 2));
      return NextResponse.json({ success: true, notifications });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
