#!/bin/bash

echo "Creating Site Settings collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="site_settings"

# Function for creating a collection with proper error handling
create_collection() {
  local db_id=$1
  local coll_id=$2
  local name=$3

  echo "Creating collection: $name ($coll_id)"

  # Try to create collection, ignore if it exists
  appwrite databases create-collection \
    --database-id $db_id \
    --collection-id $coll_id \
    --name "$name" \
    --permissions "read(\"any\")" "write(\"users\")" \
    --json || echo "Collection $coll_id may already exist"

  # Give it time to process
  sleep 2
}

# Process Site Settings collection
create_collection $DATABASE_ID "site_settings" "Site Settings"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id site_settings \
  --key key \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id site_settings \
  --key value \
  --size 10000 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id site_settings \
  --key description \
  --size 1000 \
  --required false \
  --json || echo "Attribute may exist"

# Wait for attributes to be ready
echo "Waiting for site settings attributes to be ready..."
sleep 5

# Add index for Settings
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id site_settings \
  --key by_key \
  --type unique \
  --attributes key \
  --json || echo "Index may exist or attributes not ready"

echo "Site Settings collection created successfully!"