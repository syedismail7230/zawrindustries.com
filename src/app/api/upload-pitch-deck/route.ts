import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
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
