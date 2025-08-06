-- Create tenants table for multi-tenancy support
CREATE TABLE IF NOT EXISTS tenants (
  id SERIAL PRIMARY KEY,
  tenant_id TEXT UNIQUE NOT NULL
);