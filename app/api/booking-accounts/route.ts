import { NextRequest, NextResponse } from 'next/server';
import connectionPool from '../../../db';

export interface BookingAccount {
  id: number;
  name: string;
  description: string;
  project_id: number;
  project_name?: string;
  customer_name?: string;
  created_at: string;
}

// GET all booking accounts or booking accounts by project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    let query = `
      SELECT ba.id, ba.name, ba.description, ba.project_id, 
             p.name as project_name, p.customer_name, ba.created_at 
      FROM booking_accounts ba 
      LEFT JOIN projects p ON ba.project_id = p.id
    `;
    
    const params: any[] = [];
    
    if (projectId) {
      query += ' WHERE ba.project_id = $1';
      params.push(parseInt(projectId));
    }
    
    query += ' ORDER BY ba.created_at DESC';

    const result = await connectionPool.query(query, params);
    
    return NextResponse.json({ booking_accounts: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch booking accounts' }, { status: 500 });
  }
}

// POST create new booking account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, project_id } = body;

    // Validate required fields
    if (!name || !project_id) {
      return NextResponse.json(
        { error: 'Name and project ID are required' },
        { status: 400 }
      );
    }

    // Insert new booking account
    const result = await connectionPool.query(
      `INSERT INTO booking_accounts (name, description, project_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description, project_id]
    );

    return NextResponse.json({ booking_account: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking account:', error);
    
    // Handle foreign key constraint violation
    if (error.code === '23503') {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to create booking account' }, { status: 500 });
  }
}