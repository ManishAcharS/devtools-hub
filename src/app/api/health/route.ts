import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    name: siteConfig.name,
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
}
