import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

// Simple in-memory rate limiting
const requestLog: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 9;

function isRateLimited(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;
  // Remove old entries
  while (requestLog.length > 0 && requestLog[0] < oneMinuteAgo) {
    requestLog.shift();
  }
  return requestLog.length >= MAX_REQUESTS_PER_MINUTE;
}

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured', fallback: true },
      { status: 503 }
    );
  }

  if (isRateLimited()) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 });
  }

  // Build the URL with remaining params
  const params = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== 'endpoint') params.set(key, value);
  });
  const url = `${API_BASE}/${endpoint}${params.toString() ? '?' + params.toString() : ''}`;

  try {
    requestLog.push(Date.now());
    const response = await fetch(url, {
      headers: { 'X-Auth-Token': API_KEY },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Football-data API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch from football-data.org' },
      { status: 500 }
    );
  }
}
