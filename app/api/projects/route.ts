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

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects or filter by department
 *     description: Retrieve a list of all projects, optionally filtered by department ID
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: query
 *         name: department_id
 *         schema:
 *           type: integer
 *         description: Filter projects by department ID
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project in the system
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - customer_name
 *               - department_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Project name
 *               customer_name:
 *                 type: string
 *                 description: Customer name for the project
 *               description:
 *                 type: string
 *                 description: Project description
 *               department_id:
 *                 type: integer
 *                 description: ID of the department this project belongs to
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad request - missing required fields or invalid department ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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