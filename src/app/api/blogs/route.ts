import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyWebmasterAuth } from '@/lib/webmaster-security';
import { getExistingBlogs, saveBlogs } from '@/lib/ai-blog-engine';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blogs = await getExistingBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error reading blogs:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const authCheck = await verifyWebmasterAuth(request, 'blogs', formData);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || 'Unauthorized' }, { status: 401 });
    }

    const action = formData.get('action') as string;

    // Read current data from Supabase / JSON
    let blogs = await getExistingBlogs();

    if (action === 'delete') {
      const id = formData.get('id') as string;
      blogs = blogs.filter((b: any) => b.id !== id);
      await saveBlogs(blogs);

      if (supabase) {
        try {
          await supabase.from('blogs').delete().eq('id', id);
        } catch (e) {
          console.error('Error deleting blog from Supabase:', e);
        }
      }

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
      let authorImageUrl = formData.get('authorImageUrl') as string || 'https://res.cloudinary.com/murfclni/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1783710409/zawr/assets/authors/lina.jpg';
      const authorImageFile = formData.get('authorImageFile') as File | null;
      if (authorImageFile && authorImageFile.size > 0) {
        try {
          authorImageUrl = await uploadToCloudinary(authorImageFile, 'zawr/authors');
        } catch (e: any) {
          console.error('Cloudinary author image upload failed:', e);
          return NextResponse.json({ error: `Author image upload failed: ${e.message}` }, { status: 500 });
        }
      }

      const blogData: any = {
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
        sections,
        status: 'published',
        sensitive: false,
        factCheckLayer1Passed: true,
        factCheckLayer2Passed: true,
        createdAt: new Date().toISOString(),
        helpfulness: { yes: 0, no: 0 }
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
            authorImage: authorImageUrl || blogs[index].authorImage,
            helpfulness: blogs[index].helpfulness || { yes: 0, no: 0 }
          };
        }
      }

      // Sort: newest first (newly created blogs at the top)
      blogs.sort((a: any, b: any) => b.id.localeCompare(a.id));

      await saveBlogs(blogs);
      return NextResponse.json({ success: true, blogs });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in blogs API:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
