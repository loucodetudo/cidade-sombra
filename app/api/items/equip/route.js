import { NextResponse } from 'next/server';
import { equipItem } from '../../../../src/lib/mockDb';

export async function POST(request) {
  const { userItemId } = await request.json();
  const result = equipItem(userItemId);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
