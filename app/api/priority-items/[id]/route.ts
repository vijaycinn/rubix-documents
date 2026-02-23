import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// PATCH to update a priority item's checked status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const body = await request.json();
    const { is_checked } = body;

    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    console.log('Updating item:', id, 'to:', is_checked);

    const stmt = db.prepare(`
      UPDATE priority_items
      SET is_checked = ?
      WHERE id = ?
    `);

    const result = stmt.run(is_checked, id);

    console.log('Update result:', result);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Item updated successfully',
      changes: result.changes
    });
  } catch (error) {
    console.error('Error updating priority item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
