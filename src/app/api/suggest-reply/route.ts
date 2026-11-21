import { NextRequest, NextResponse } from 'next/server';
import { generateMerchantReply } from '@/lib/ai-client';
import { getCachedReply, setCachedReply } from '@/lib/cache';
import { computeReviewHash } from '@/lib/hash';
import { CleanedReview } from '@/types/review';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const review: CleanedReview = body.review;
    const clientKey = req.headers.get('x-api-key') || req.headers.get('x-gemini-key') || body.apiKey;
    const clientModel = req.headers.get('x-ai-model') || body.model;

    if (!review || (!review.review_text && !review.cleaned_text)) {
      return NextResponse.json(
        { success: false, error: 'Review content is required' },
        { status: 400 }
      );
    }

    const textHash = review.text_hash || computeReviewHash(review.cleaned_text || review.review_text);

    // Check if reply is already cached
    const cachedReply = getCachedReply(textHash);
    if (cachedReply) {
      return NextResponse.json({
        success: true,
        reply: cachedReply,
        cached: true,
      });
    }

    // Generate fresh reply via AI
    const effectiveApiKey = clientKey || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
    const effectiveModel = clientModel || process.env.AI_MODEL || 'gemini-1.5-flash';

    const reply = await generateMerchantReply(review, {
      apiKey: effectiveApiKey,
      model: effectiveModel,
      provider: effectiveApiKey?.startsWith('gsk_') ? 'groq' : 'gemini',
    });

    // Save to persistent cache
    setCachedReply(textHash, reply);

    return NextResponse.json({
      success: true,
      reply,
      cached: false,
    });
  } catch (err: any) {
    console.error('[API /api/suggest-reply] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to generate merchant reply.',
      },
      { status: 500 }
    );
  }
}
