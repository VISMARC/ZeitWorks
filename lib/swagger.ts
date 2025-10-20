import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Time Booking API",
        version: "1.0",
        description: "API for managing time booking system with users, departments, projects, and booking accounts",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
              role: { type: "string" },
              department: { type: "string" },
              created_at: { type: "string", format: "date-time" },
            },
          },
          Department: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              description: { type: "string" },
              created_at: { type: "string", format: "date-time" },
            },
          },
          Project: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              customer_name: { type: "string" },
              description: { type: "string" },
              department_id: { type: "number" },
              department_name: { type: "string" },
              created_at: { type: "string", format: "date-time" },
            },
          },
          BookingAccount: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              description: { type: "string" },
              project_id: { type: "number" },
              project_name: { type: "string" },
              customer_name: { type: "string" },
              created_at: { type: "string", format: "date-time" },
            },
          },
          Error: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
      security: [],
    },
  });
  return spec;
};