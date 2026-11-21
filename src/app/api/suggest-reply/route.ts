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
    const reply = await generateMerchantReply(review);

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
