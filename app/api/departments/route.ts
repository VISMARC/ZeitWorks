import { NextRequest, NextResponse } from 'next/server';
import connectionPool from '../../../db';

export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

// GET all departments
export async function GET() {
  try {
    const result = await connectionPool.query(
      'SELECT id, name, description, created_at FROM departments ORDER BY name'
    );
    
    return NextResponse.json({ departments: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

// POST create new department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Insert new department
    const result = await connectionPool.query(
      'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );

    return NextResponse.json({ department: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating department:', error);
    
    // Handle unique constraint violation (duplicate name)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Department name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}