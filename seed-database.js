const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Create connection pool directly in the seed file
const connectionPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Sample users data
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'developer',
    department: 'engineering',
    created_at: new Date()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'designer',
    department: 'design',
    created_at: new Date()
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'manager',
    department: 'engineering',
    created_at: new Date()
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'analyst',
    department: 'business',
    created_at: new Date()
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'developer',
    department: 'engineering',
    created_at: new Date()
  },
  {
    id: 6,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'tester',
    department: 'quality assurance',
    created_at: new Date()
  },
  {
    id: 7,
    name: 'Chris Miller',
    email: 'chris.miller@example.com',
    role: 'developer',
    department: 'engineering',
    created_at: new Date()
  },
  {
    id: 8,
    name: 'Lisa Garcia',
    email: 'lisa.garcia@example.com',
    role: 'designer',
    department: 'design',
    created_at: new Date()
  }
];

async function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      role VARCHAR(50) NOT NULL,
      department VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await connectionPool.query(createTableQuery);
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
}

async function seedUsers() {
  try {
    // First, create the table
    await createUsersTable();
    
    // Clear existing data
    await connectionPool.query('DELETE FROM users');
    console.log('Cleared existing users data');
    
    // Insert users
    for (const user of users) {
      const insertQuery = `
        INSERT INTO users (name, email, role, department, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      
      const result = await connectionPool.query(insertQuery, [
        user.name,
        user.email,
        user.role,
        user.department,
        user.created_at
      ]);
      
      console.log(`Inserted user: ${user.name} with ID: ${result.rows[0].id}`);
    }
    
    console.log('Database seeding completed successfully!');
    console.log(`Total users inserted: ${users.length}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection pool
    await connectionPool.end();
  }
}

// Run the seeding function
seedUsers();
