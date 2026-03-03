import { NextResponse } from 'next/server';
import { listInventory } from '../../../src/lib/mockDb';

export async function GET() {
  return NextResponse.json({ inventory: listInventory() });
}
