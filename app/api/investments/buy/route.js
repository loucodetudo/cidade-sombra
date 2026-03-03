import { NextResponse } from 'next/server';
import { buyInvestment } from '../../../../src/lib/mockDb';

export async function POST(request) {
  const { investmentId } = await request.json();
  const result = buyInvestment(investmentId);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
