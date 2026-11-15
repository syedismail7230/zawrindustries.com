import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'blogs.json');

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    const data = await fs.readFile(dataFilePath, 'utf-8');
    const blogs = JSON.parse(data);

    if (slug) {
      const blog = blogs.find((b: any) => b.slug === slug || b.id === slug);
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json({
        slug: blog.slug,
        title: blog.title,
        helpfulness: blog.helpfulness || { yes: 0, no: 0 }
      });
    }

    // Return aggregate summary across all blogs
    let totalYes = 0;
    let totalNo = 0;
    const perBlog = blogs.map((b: any) => {
      const yes = b.helpfulness?.yes || 0;
      const no = b.helpfulness?.no || 0;
      totalYes += yes;
      totalNo += no;
      return {
        id: b.id,
        slug: b.slug,
        title: b.title,
        category: b.category,
        yes,
        no,
        total: yes + no,
        ratio: yes + no > 0 ? Math.round((yes / (yes + no)) * 100) : 0
      };
    });

    const totalVotes = totalYes + totalNo;
    const approvalRate = totalVotes > 0 ? Math.round((totalYes / totalVotes) * 100) : 0;

    return NextResponse.json({
      totalYes,
      totalNo,
      totalVotes,
      approvalRate,
      blogs: perBlog
    });
  } catch (error: any) {
    console.error('Error fetching blog feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, vote, previousVote } = body;

    if (!slug || (vote !== 'yes' && vote !== 'no')) {
      return NextResponse.json({ error: 'Invalid parameters: slug and vote (yes|no) required' }, { status: 400 });
    }

    const data = await fs.readFile(dataFilePath, 'utf-8');
    const blogs = JSON.parse(data);

    const index = blogs.findIndex((b: any) => b.slug === slug || b.id === slug);
    if (index === -1) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const blog = blogs[index];
    blog.helpfulness = blog.helpfulness || { yes: 0, no: 0 };

    // If changing vote from previous
    if (previousVote === 'yes' || previousVote === 'no') {
      if (previousVote !== vote) {
        blog.helpfulness[previousVote] = Math.max(0, (blog.helpfulness[previousVote] || 0) - 1);
        blog.helpfulness[vote] = (blog.helpfulness[vote] || 0) + 1;
      }
    } else {
      // New vote
      blog.helpfulness[vote] = (blog.helpfulness[vote] || 0) + 1;
    }

    blogs[index] = blog;
    await fs.writeFile(dataFilePath, JSON.stringify(blogs, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      slug: blog.slug,
      helpfulness: blog.helpfulness
    });
  } catch (error: any) {
    console.error('Error recording blog feedback:', error);
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
  }
}
