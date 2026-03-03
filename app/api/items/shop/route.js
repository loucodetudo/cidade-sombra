import { NextResponse } from 'next/server';
import { listShop } from '../../../../src/lib/mockDb';

export async function GET() {
  return NextResponse.json({ items: listShop() });
}
