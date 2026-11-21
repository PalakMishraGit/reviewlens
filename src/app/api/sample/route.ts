import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const csvPath = path.resolve(process.cwd(), 'reviews.csv');
    if (fs.existsSync(csvPath)) {
      const csv = fs.readFileSync(csvPath, 'utf8');
      return NextResponse.json({
        success: true,
        filename: 'reviews.csv',
        csv,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Benchmark reviews.csv not found' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
