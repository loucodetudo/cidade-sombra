import { NextResponse } from 'next/server';
import { buyItem } from '../../../../src/lib/mockDb';

export async function POST(request) {
  const { itemId } = await request.json();
  const result = buyItem(itemId);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
