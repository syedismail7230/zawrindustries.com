import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'events.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading events:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;
    
    // Read current data
    let events = [];
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      events = JSON.parse(data);
    } catch (e) {
      events = [];
    }

    if (action === 'delete') {
      const id = formData.get('id') as string;
      events = events.filter((e: any) => e.id !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(events, null, 2));
      return NextResponse.json({ success: true, events });
    }

    if (action === 'add' || action === 'update') {
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const startDate = formData.get('startDate') as string;
      const endDate = formData.get('endDate') as string || startDate; // range fallback to single date
      const startTime = formData.get('startTime') as string || '00:00:00';
      const endTime = formData.get('endTime') as string || '00:00:00';
      let id = formData.get('id') as string;
      if (action === 'add') {
        id = Date.now().toString();
      }
      const image = formData.get('image') as string || '/assets/event-chart.png';
      
      const eventData = { id, title, description, startDate, endDate, startTime, endTime, image };

      if (action === 'add') {
        events.push(eventData);
      } else {
        const index = events.findIndex((e: any) => e.id === id);
        if (index > -1) {
          events[index] = eventData;
        }
      }

      await fs.writeFile(dataFilePath, JSON.stringify(events, null, 2));
      return NextResponse.json({ success: true, events });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error in events API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
