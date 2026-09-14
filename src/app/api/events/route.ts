import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyWebmasterAuth } from '@/lib/webmaster-security';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'events.json');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error reading events:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const authCheck = await verifyWebmasterAuth(request, 'events', formData);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || 'Unauthorized' }, { status: 401 });
    }

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
      const subtitle = formData.get('subtitle') as string || '';
      const description = formData.get('description') as string;
      const startDate = formData.get('startDate') as string;
      const endDate = formData.get('endDate') as string || startDate;
      const startTime = formData.get('startTime') as string || '00:00:00';
      const endTime = formData.get('endTime') as string || '00:00:00';
      const ticketsBooked = formData.get('ticketsBooked') as string || '0';
      const ticketsCapacity = formData.get('ticketsCapacity') as string || '100';
      const venue = formData.get('venue') as string || 'Online';
      const specialNote = formData.get('specialNote') as string || '';
      
      let id = formData.get('id') as string;
      if (action === 'add') {
        id = Date.now().toString();
      }
      const image = formData.get('image') as string || 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1783710478/zawr/assets/event-chart.png';
      
      const eventData = { 
        id, 
        title, 
        subtitle, 
        description, 
        startDate, 
        endDate, 
        startTime, 
        endTime, 
        image,
        ticketsBooked,
        ticketsCapacity,
        venue,
        specialNote
      };

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
