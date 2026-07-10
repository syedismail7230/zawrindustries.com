import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { uploadToCloudinary } from '@/lib/cloudinary';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'blogs.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading blogs:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;

    // Read current data
    let blogs = [];
    try {
      const data = await fs.readFile(dataFilePath, 'utf-8');
      blogs = JSON.parse(data);
    } catch (e) {
      blogs = [];
    }

    if (action === 'delete') {
      const id = formData.get('id') as string;
      blogs = blogs.filter((b: any) => b.id !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(blogs, null, 2));
      return NextResponse.json({ success: true, blogs });
    }

    if (action === 'add' || action === 'update') {
      const title = formData.get('title') as string;
      const author = formData.get('author') as string || 'Webmaster';
      const date = formData.get('date') as string || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const category = formData.get('category') as string || 'General';
      const summary = formData.get('summary') as string || '';
      const readTime = formData.get('readTime') as string || '5 min read';
      const sectionsJson = formData.get('sections') as string || '[]';
      
      let id = formData.get('id') as string;
      if (action === 'add') {
        id = `BLOG-${Date.now()}`;
      }

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Parse existing sections
      const sections = JSON.parse(sectionsJson);

      // Handle Blog Image Upload
      let imageUrl = formData.get('imageUrl') as string || '';
      const blogImageFile = formData.get('imageFile') as File | null;
      if (blogImageFile && blogImageFile.size > 0) {
        try {
          imageUrl = await uploadToCloudinary(blogImageFile, 'zawr/blogs');
        } catch (e: any) {
          console.error('Cloudinary blog cover upload failed:', e);
          return NextResponse.json({ error: `Cover image upload failed: ${e.message}` }, { status: 500 });
        }
      }

      // Handle Author Image Upload
      let authorImageUrl = formData.get('authorImageUrl') as string || '/assets/authors/lina.png';
      const authorImageFile = formData.get('authorImageFile') as File | null;
      if (authorImageFile && authorImageFile.size > 0) {
        try {
          authorImageUrl = await uploadToCloudinary(authorImageFile, 'zawr/authors');
        } catch (e: any) {
          console.error('Cloudinary author image upload failed:', e);
          return NextResponse.json({ error: `Author image upload failed: ${e.message}` }, { status: 500 });
        }
      }

      const blogData = {
        id,
        slug,
        title,
        author,
        authorImage: authorImageUrl,
        date,
        category,
        summary,
        image: imageUrl,
        readTime,
        sections
      };

      if (action === 'add') {
        blogs.push(blogData);
      } else {
        const index = blogs.findIndex((b: any) => b.id === id);
        if (index > -1) {
          // preserve fields if not provided
          blogs[index] = {
            ...blogs[index],
            ...blogData,
            image: imageUrl || blogs[index].image,
            authorImage: authorImageUrl || blogs[index].authorImage
          };
        }
      }

      // Sort: newest first (newly created blogs at the top)
      blogs.sort((a: any, b: any) => b.id.localeCompare(a.id));

      await fs.writeFile(dataFilePath, JSON.stringify(blogs, null, 2));
      return NextResponse.json({ success: true, blogs });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in blogs API:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
