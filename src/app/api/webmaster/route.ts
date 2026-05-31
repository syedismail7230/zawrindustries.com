import { NextResponse } from 'next/server';

// Secure server-side environment variable fallbacks
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEBMASTER_ACCESS_KEY || 'GDkehiuih873276##@';

const SECURITY_QUESTIONS = [
  {
    id: 1,
    question: process.env.WEBMASTER_Q1 || "What was the name of your first childhood pet?",
    answer: (process.env.WEBMASTER_A1 || "shadow").trim().toLowerCase()
  },
  {
    id: 2,
    question: process.env.WEBMASTER_Q2 || "In which street did you live during your primary school years?",
    answer: (process.env.WEBMASTER_A2 || "elmst").trim().toLowerCase()
  },
  {
    id: 3,
    question: process.env.WEBMASTER_Q3 || "What is the secret middle name of your favorite grandparent?",
    answer: (process.env.WEBMASTER_A3 || "elizabeth").trim().toLowerCase()
  },
  {
    id: 4,
    question: process.env.WEBMASTER_Q4 || "What was the brand of the very first computer you owned?",
    answer: (process.env.WEBMASTER_A4 || "commodore").trim().toLowerCase()
  },
  {
    id: 5,
    question: process.env.WEBMASTER_Q5 || "What is the exact name of the street where you had your first job?",
    answer: (process.env.WEBMASTER_A5 || "broadway").trim().toLowerCase()
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Phase 1: Retrieve a random question challenge securely (requires valid Access Key)
    if (action === 'get-challenge') {
      const { accessKey } = body;

      // Validate the Access Key first before revealing any challenge question
      if (accessKey !== ACCESS_KEY) {
        return NextResponse.json({ success: false, error: 'Incorrect Webmaster Access Key' }, { status: 401 });
      }

      const randomIndex = Math.floor(Math.random() * SECURITY_QUESTIONS.length);
      const questionItem = SECURITY_QUESTIONS[randomIndex];
      return NextResponse.json({ 
        success: true, 
        questionId: questionItem.id, 
        question: questionItem.question 
      });
    }

    // Phase 2: Verify Access Key and Security Answer
    if (action === 'verify') {
      const { accessKey, questionId, answer } = body;

      // Validate the Access Key first
      if (accessKey !== ACCESS_KEY) {
        return NextResponse.json({ success: false, error: 'Incorrect access key' }, { status: 401 });
      }

      // Find the corresponding question
      const questionItem = SECURITY_QUESTIONS.find(q => q.id === Number(questionId));
      if (!questionItem) {
        return NextResponse.json({ success: false, error: 'Invalid challenge session' }, { status: 400 });
      }

      // Verify the answer (case-insensitive and trimmed)
      const cleanUserAnswer = (answer || '').trim().toLowerCase();
      if (cleanUserAnswer === questionItem.answer) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: 'Incorrect security answer' }, { status: 401 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
