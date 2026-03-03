import { NextResponse } from 'next/server';
import { listInvestments } from '../../../../src/lib/mockDb';

export async function GET() {
  return NextResponse.json({ investments: listInvestments() });
}
