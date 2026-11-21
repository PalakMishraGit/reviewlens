import { NextResponse } from 'next/server';
import { getCacheStats, clearCache } from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = getCacheStats();
  return NextResponse.json({
    success: true,
    stats,
  });
}

export async function DELETE() {
  clearCache();
  return NextResponse.json({
    success: true,
    message: 'Review cache has been cleared successfully.',
  });
}
