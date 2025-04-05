#!/bin/bash

echo "Creating Categories collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="categories"

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

# Process Categories Collection
create_collection $DATABASE_ID "categories" "Categories"

# Add attributes for Categories
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id categories \
  --key name \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id categories \
  --key description \
  --size 5000 \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id categories \
  --key parent_id \
  --size 255 \
  --required false \
  --json || echo "Attribute may exist"

# Wait longer to ensure attributes are ready
echo "Waiting for category attributes to be ready..."
sleep 5

# Add index for Categories
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id categories \
  --key by_type \
  --type key \
  --attributes type \
  --json || echo "Index may exist or attributes not ready"

echo "Categories collection created successfully!"