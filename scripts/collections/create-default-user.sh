#!/bin/bash

echo "Creating default user for Portfolio"


DEFAULT_USER_EMAIL="admin@example.com"
DEFAULT_USER_PASSWORD="StrongPassword"


# Create the default user
echo "Creating default user with email: $DEFAULT_USER_EMAIL"
appwrite users create \
  --user-id "unique()" \
  --email "$DEFAULT_USER_EMAIL" \
  --password "$DEFAULT_USER_PASSWORD" \
  --name "Portfolio Admin"  --json || echo "User may already exist or creation failed"

echo "Default user creation completed!"
