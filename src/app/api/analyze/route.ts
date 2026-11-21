import { NextRequest, NextResponse } from 'next/server';
import { parseCsvString, cleanReviews } from '@/lib/csv-parser';
import { processReviewsInBatches } from '@/lib/batch-processor';
import { computeAnalysisMetrics } from '@/lib/metrics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let csvContent = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided in form data' },
          { status: 400 }
        );
      }
      csvContent = await file.text();
    } else {
      const body = await req.json();
      csvContent = body.csvText || '';
    }

    if (!csvContent || !csvContent.trim()) {
      return NextResponse.json(
        { success: false, error: 'CSV content is empty' },
        { status: 400 }
      );
    }

    // 1. Parse CSV (RFC 4180)
    const rawRows = parseCsvString(csvContent);
    if (rawRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid data rows found in CSV' },
        { status: 400 }
      );
    }

    // 2. Clean, sanitize & deduplicate
    const cleanedReviews = cleanReviews(rawRows);

    // 3. Process batches with AI / Cache
    const { reviews, telemetry } = await processReviewsInBatches(cleanedReviews);

    // 4. Compute executive summary & KPIs
    const summary = computeAnalysisMetrics(reviews, telemetry);

    return NextResponse.json({
      success: true,
      reviews,
      summary,
    });
  } catch (err: any) {
    console.error('[API /api/analyze] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'An unexpected error occurred during review analysis.',
      },
      { status: 500 }
    );
  }
}
