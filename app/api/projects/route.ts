import { NextRequest, NextResponse } from 'next/server';
import connectionPool from '../../../db';

export interface Project {
  id: number;
  name: string;
  customer_name: string;
  description: string;
  department_id: number;
  department_name?: string;
  created_at: string;
}

// GET all projects or projects by department
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('department_id');

    let query = `
      SELECT p.id, p.name, p.customer_name, p.description, p.department_id, 
             d.name as department_name, p.created_at 
      FROM projects p 
      LEFT JOIN departments d ON p.department_id = d.id
    `;
    
    const params: any[] = [];
    
    if (departmentId) {
      query += ' WHERE p.department_id = $1';
      params.push(parseInt(departmentId));
    }
    
    query += ' ORDER BY p.created_at DESC';

    const result = await connectionPool.query(query, params);
    
    return NextResponse.json({ projects: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, customer_name, description, department_id } = body;

    // Validate required fields
    if (!name || !customer_name || !department_id) {
      return NextResponse.json(
        { error: 'Name, customer name, and department ID are required' },
        { status: 400 }
      );
    }

    // Insert new project
    const result = await connectionPool.query(
      `INSERT INTO projects (name, customer_name, description, department_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, customer_name, description, department_id]
    );

    return NextResponse.json({ project: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    // Handle foreign key constraint violation
    if (error.code === '23503') {
      return NextResponse.json(
        { error: 'Invalid department ID' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}