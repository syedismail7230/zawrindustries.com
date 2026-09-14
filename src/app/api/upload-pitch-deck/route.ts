import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { verifyWebmasterAuth } from '@/lib/webmaster-security';

export async function GET() {
  return NextResponse.json({ status: 'healthy', service: 'upload-pitch-deck', timestamp: new Date().toISOString() });
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const authCheck = await verifyWebmasterAuth(request, 'pitch-deck', data);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || 'Unauthorized' }, { status: 401 });
    }

    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save exactly to public/assets/pitch-deck.pdf
    const publicPath = path.join(process.cwd(), 'public', 'assets', 'pitch-deck.pdf');
    await writeFile(publicPath, buffer);

    return NextResponse.json({ success: true, message: 'Pitch deck uploaded successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
