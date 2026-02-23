import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all priority items
export async function GET() {
  try {
    const items = db.prepare('SELECT * FROM priority_items ORDER BY category, id').all();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching priority items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST new priority item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, item_text, description, priority_level } = body;

    const stmt = db.prepare(`
      INSERT INTO priority_items (category, item_text, description, priority_level)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(category, item_text, description, priority_level);
    
    return NextResponse.json({ 
      id: result.lastInsertRowid,
      message: 'Item created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating priority item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
