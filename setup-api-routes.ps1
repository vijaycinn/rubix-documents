# Create necessary directories and files for CJN Dakota County features
# Run this from the cjn-dakota-docs directory

Write-Host "Creating API routes and components..." -ForegroundColor Green

# Create API directory structure
New-Item -ItemType Directory -Force -Path "app\api\priority-items\[id]" | Out-Null

# Create API route files
Write-Host "Creating API route: app\api\priority-items\route.ts" -ForegroundColor Cyan
$priorityRoute = @'
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
'@
Set-Content -Path "app\api\priority-items\route.ts" -Value $priorityRoute

Write-Host "Creating API route: app\api\priority-items\[id]\route.ts" -ForegroundColor Cyan
$idRoute = @'
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// PATCH update priority item (toggle checkbox)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { is_checked } = body;

    const stmt = db.prepare(`
      UPDATE priority_items 
      SET is_checked = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(is_checked ? 1 : 0, id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating priority item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE priority item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const stmt = db.prepare('DELETE FROM priority_items WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting priority item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
'@
Set-Content -Path "app\api\priority-items\[id]\route.ts" -Value $idRoute

# Create content directories
New-Item -ItemType Directory -Force -Path "contents\docs\architecture" | Out-Null
New-Item -ItemType Directory -Force -Path "contents\docs\priority-matrix" | Out-Null

Write-Host "`nAPI routes created successfully!" -ForegroundColor Green
Write-Host "Next: Create content pages for architecture and priority matrix" -ForegroundColor Yellow
