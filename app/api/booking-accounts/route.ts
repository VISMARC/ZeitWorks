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

/**
 * @swagger
 * /api/booking-accounts:
 *   get:
 *     summary: Get all booking accounts or filter by project
 *     description: Retrieve a list of all booking accounts, optionally filtered by project ID
 *     tags:
 *       - Booking Accounts
 *     parameters:
 *       - in: query
 *         name: project_id
 *         schema:
 *           type: integer
 *         description: Filter booking accounts by project ID
 *     responses:
 *       200:
 *         description: List of booking accounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking_accounts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookingAccount'
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

/**
 * @swagger
 * /api/booking-accounts:
 *   post:
 *     summary: Create a new booking account
 *     description: Create a new booking account for a project
 *     tags:
 *       - Booking Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - project_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Booking account name
 *               description:
 *                 type: string
 *                 description: Booking account description
 *               project_id:
 *                 type: integer
 *                 description: ID of the project this booking account belongs to
 *     responses:
 *       201:
 *         description: Booking account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking_account:
 *                   $ref: '#/components/schemas/BookingAccount'
 *       400:
 *         description: Bad request - missing required fields or invalid project ID
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