import { NextRequest, NextResponse } from 'next/server';
import connectionPool from '../../../db';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  created_at: string;
}

// GET all users
export async function GET() {
  try {
    const result = await connectionPool.query(
      'SELECT id, name, email, role, department, created_at FROM users ORDER BY created_at DESC'
    );
    
    return NextResponse.json({ users: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, department } = body;

    // Validate required fields
    if (!name || !email || !role || !department) {
      return NextResponse.json(
        { error: 'All fields (name, email, role, department) are required' },
        { status: 400 }
      );
    }

    // Insert new user
    const result = await connectionPool.query(
      'INSERT INTO users (name, email, role, department) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, role, department]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
