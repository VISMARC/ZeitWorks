# Database Setup Instructions

## Prerequisites
1. Docker and Docker Compose installed on your system
2. The project uses Docker Compose to run PostgreSQL

## Setup Steps

### 1. Start the Database with Docker Compose
From the root directory of the project, run:
```bash
docker-compose up -d db
```

This will start:
- PostgreSQL database on port 5432 (mapped to host)
- Adminer (database management tool) on port 8080

You can also start both services at once:
```bash
docker-compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
The `.env.local` file is already configured to work with the Docker Compose setup:

```env
POSTGRES_URL="postgres://postgres:example@127.0.0.1:5432/postgres"
POSTGRES_URL_NON_POOLING="postgres://postgres:example@127.0.0.1:5432/postgres"
POSTGRES_USER="postgres"
POSTGRES_HOST="127.0.0.1"
POSTGRES_PASSWORD="example"
POSTGRES_DATABASE="postgres"
```

### 4. Seed the Database
Run the seeding script to create the users table and populate it with sample data:
```bash
npm run seed
```

This will:
- Create a `users` table with the following structure:
  - id (SERIAL PRIMARY KEY)
  - name (VARCHAR(100))
  - email (VARCHAR(100) UNIQUE)
  - role (VARCHAR(50))
  - department (VARCHAR(50))
  - created_at (TIMESTAMP)
- Insert 8 sample users

### 5. Access Database Management (Optional)
You can access Adminer (web-based database management) at:
```
http://localhost:8080
```

Login credentials:
- System: PostgreSQL
- Server: db
- Username: postgres
- Password: example
- Database: postgres

### 6. Start Development Server
```bash
npm run dev
```

## API Endpoints

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department

### Projects  
- `GET /api/projects` - Get all projects
- `GET /api/projects?department_id=1` - Get projects by department
- `POST /api/projects` - Create new project

### Booking Accounts
- `GET /api/booking-accounts` - Get all booking accounts
- `GET /api/booking-accounts?project_id=1` - Get booking accounts by project
- `POST /api/booking-accounts` - Create new booking account

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

## Database Schema

### Departments Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| description | TEXT | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Projects Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(200) | NOT NULL |
| customer_name | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| department_id | INTEGER | REFERENCES departments(id) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Booking Accounts Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| description | TEXT | |
| project_id | INTEGER | REFERENCES projects(id) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| role | VARCHAR(50) | NOT NULL |
| department | VARCHAR(50) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

## Sample Data
The seeding script will create:
- **5 Departments**: IoT Solutions, Industry 4.0, App Development, DevOps & Cloud, Data Analytics
- **10 Projects**: Including projects for BMW, Mercedes-Benz, Siemens, Volkswagen, Bosch, BASF, SAP, Adidas, Deutsche Bank, and Bayer
- **50 Booking Accounts**: 5 accounts per project (Scrum Meetings, Refinement Sessions, Development Work, Business Analysis, Quality Assurance)
- **8 Users**: Across different roles and departments
