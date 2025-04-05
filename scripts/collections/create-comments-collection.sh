#!/bin/bash

echo "Creating Comments collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="comments"

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

# Process Comments collection
create_collection $DATABASE_ID "comments" "Comments"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id comments \
  --key content_id \
  --size 36 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id comments \
  --key content_type \
  --size 50 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id comments \
  --key user_id \
  --size 36 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id comments \
  --key text \
  --size 5000 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id comments \
  --key date \
  --size 50 \
  --required true \
  --json || echo "Attribute may exist"

# Wait for attributes to be ready
echo "Waiting for comment attributes to be ready..."
sleep 5

# Add indexes for Comments
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id comments \
  --key by_content \
  --type key \
  --attributes content_id \
  --json || echo "Index may exist or attributes not ready"

appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id comments \
  --key by_user \
  --type key \
  --attributes user_id \
  --json || echo "Index may exist or attributes not ready"

echo "Comments collection created successfully!"