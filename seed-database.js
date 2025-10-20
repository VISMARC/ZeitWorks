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

// Sample data
const departments = [
  { name: 'IoT Solutions', description: 'Internet of Things development and consulting' },
  { name: 'Industry 4.0', description: 'Industrial automation and digitalization' },
  { name: 'App Development', description: 'Mobile and web application development' },
  { name: 'DevOps & Cloud', description: 'DevOps practices and cloud infrastructure' },
  { name: 'Data Analytics', description: 'Business intelligence and data science' }
];

const projects = [
  { name: 'BMW Connected Car Platform', customer_name: 'BMW AG', description: 'IoT platform for connected vehicles', department_id: 1 },
  { name: 'Mercedes Production Line Optimization', customer_name: 'Mercedes-Benz AG', description: 'Industry 4.0 solution for production efficiency', department_id: 2 },
  { name: 'Siemens Mobile Workforce App', customer_name: 'Siemens AG', description: 'Mobile app for field technicians', department_id: 3 },
  { name: 'Volkswagen CI/CD Pipeline', customer_name: 'Volkswagen AG', description: 'DevOps automation for software delivery', department_id: 4 },
  { name: 'Bosch Production Analytics', customer_name: 'Robert Bosch GmbH', description: 'Data analytics for manufacturing insights', department_id: 5 },
  { name: 'BASF Smart Factory Initiative', customer_name: 'BASF SE', description: 'IoT sensors and monitoring systems', department_id: 1 },
  { name: 'SAP Digital Twin Platform', customer_name: 'SAP SE', description: 'Digital twin implementation for Industry 4.0', department_id: 2 },
  { name: 'Adidas E-Commerce Portal', customer_name: 'Adidas AG', description: 'Next-generation shopping experience', department_id: 3 },
  { name: 'Deutsche Bank Cloud Migration', customer_name: 'Deutsche Bank AG', description: 'Cloud infrastructure modernization', department_id: 4 },
  { name: 'Bayer Research Data Platform', customer_name: 'Bayer AG', description: 'Advanced analytics for pharmaceutical research', department_id: 5 }
];

const bookingAccounts = [
  'Scrum Meetings',
  'Refinement Sessions', 
  'Development Work',
  'Business Analysis',
  'Quality Assurance'
];

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

async function createTables() {
  // Create departments table
  const createDepartmentsQuery = `
    CREATE TABLE IF NOT EXISTS departments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create projects table
  const createProjectsQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      customer_name VARCHAR(200) NOT NULL,
      description TEXT,
      department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create booking_accounts table
  const createBookingAccountsQuery = `
    CREATE TABLE IF NOT EXISTS booking_accounts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create users table
  const createUsersQuery = `
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
    await connectionPool.query(createDepartmentsQuery);
    console.log('Departments table created successfully');
    
    await connectionPool.query(createProjectsQuery);
    console.log('Projects table created successfully');
    
    await connectionPool.query(createBookingAccountsQuery);
    console.log('Booking accounts table created successfully');
    
    await connectionPool.query(createUsersQuery);
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    // First, create all tables
    await createTables();
    
    // Clear existing data (order matters due to foreign keys)
    await connectionPool.query('DELETE FROM booking_accounts');
    await connectionPool.query('DELETE FROM projects');
    await connectionPool.query('DELETE FROM departments');
    await connectionPool.query('DELETE FROM users');
    console.log('Cleared existing data');
    
    // Insert departments first
    const departmentIds = [];
    for (const dept of departments) {
      const insertQuery = `
        INSERT INTO departments (name, description)
        VALUES ($1, $2)
        RETURNING id;
      `;
      
      const result = await connectionPool.query(insertQuery, [dept.name, dept.description]);
      departmentIds.push(result.rows[0].id);
      console.log(`Inserted department: ${dept.name} with ID: ${result.rows[0].id}`);
    }
    
    // Insert projects
    const projectIds = [];
    for (const project of projects) {
      const insertQuery = `
        INSERT INTO projects (name, customer_name, description, department_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `;
      
      const result = await connectionPool.query(insertQuery, [
        project.name,
        project.customer_name,
        project.description,
        project.department_id
      ]);
      projectIds.push(result.rows[0].id);
      console.log(`Inserted project: ${project.name} with ID: ${result.rows[0].id}`);
    }
    
    // Insert booking accounts (5 for each project)
    let bookingAccountCount = 0;
    for (const projectId of projectIds) {
      for (const accountName of bookingAccounts) {
        const insertQuery = `
          INSERT INTO booking_accounts (name, description, project_id)
          VALUES ($1, $2, $3)
          RETURNING id;
        `;
        
        const description = `${accountName} activities for project`;
        const result = await connectionPool.query(insertQuery, [
          accountName,
          description,
          projectId
        ]);
        bookingAccountCount++;
        console.log(`Inserted booking account: ${accountName} for project ${projectId} with ID: ${result.rows[0].id}`);
      }
    }
    
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
    
    console.log('\n=== Database seeding completed successfully! ===');
    console.log(`Total departments inserted: ${departments.length}`);
    console.log(`Total projects inserted: ${projects.length}`);
    console.log(`Total booking accounts inserted: ${bookingAccountCount}`);
    console.log(`Total users inserted: ${users.length}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection pool
    await connectionPool.end();
  }
}

// Run the seeding function
seedDatabase();
