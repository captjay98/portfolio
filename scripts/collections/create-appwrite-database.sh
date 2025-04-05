#!/bin/bash

echo "Creating Appwrite database for Portfolio"

# Set up variables
DATABASE_ID="portfolio"

# Create the database
echo "Creating database: $DATABASE_ID"
appwrite databases create \
  --database-id $DATABASE_ID \
  --name "Portfolio Database"  --json || echo "Database $DATABASE_ID may already exist"

echo "Waiting for database to be ready..."
sleep 5

echo "Database created successfully!"