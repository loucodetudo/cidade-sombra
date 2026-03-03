import { NextResponse } from 'next/server';
import { collectInvestments } from '../../../../src/lib/mockDb';

export async function POST() {
  return NextResponse.json(collectInvestments());
}
