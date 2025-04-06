import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get('region');
  const maxPrice = parseFloat(searchParams.get('max_price') || '');
  const gpuModel = searchParams.get('gpu_model');

  const filePath = path.resolve('./data/vast_gpu_listings.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  let listings = JSON.parse(raw);

  if (region) {
    listings = listings.filter((l: any) => l.location === region);
  }
  if (!isNaN(maxPrice)) {
    listings = listings.filter((l: any) => l["$/hr"] <= maxPrice);
  }
  if (gpuModel) {
    listings = listings.filter((l: any) =>
      l["GPU model"].toLowerCase().includes(gpuModel.toLowerCase())
    );
  }

  return NextResponse.json(listings.slice(0, 25)); // limit response
}

