import { NextResponse } from 'next/server';
import { generateMissions } from '../../../../src/lib/gameData';

export async function GET() {
  const missions = generateMissions(100);
  return NextResponse.json({ total: missions.length, missions });
}
