import { NextRequest, NextResponse } from 'next/server';
import connectionPool from '../../../db';

export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     description: Retrieve a list of all departments in the system
 *     tags:
 *       - Departments
 *     responses:
 *       200:
 *         description: List of departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 departments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a new department
 *     description: Create a new department in the system
 *     tags:
 *       - Departments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Department name
 *               description:
 *                 type: string
 *                 description: Department description
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 department:
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - department name already exists
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