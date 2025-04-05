#!/bin/bash

echo "Creating Experience Accomplishments collection"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="experience_accomplishments"

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
    --json || echo "Collection may already exist"

  # Give it time to process
  sleep 2
}

# Process Experience Accomplishments collection
echo "Creating Experience Accomplishments collection..."
create_collection $DATABASE_ID $COLLECTION_ID "Experience Accomplishments"

# Add Experience Accomplishment attributes
echo "Adding attributes to Experience Accomplishments collection..."

# Experience ID reference
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key experience_id \
  --size 36 \
  --required true \
  --json || echo "Attribute may exist"

# Accomplishment text
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key text \
  --size 1000 \
  --required true \
  --json || echo "Attribute may exist"

# Order for sorting
appwrite databases create-integer-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key order \
  --required true \
  --json || echo "Attribute may exist"

# Wait for attributes to be ready
echo "Waiting for attributes to be ready..."
sleep 5

# Create indexes
echo "Creating indexes for Experience Accomplishments..."
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key by_experience \
  --type key \
  --attributes experience_id \
  --json || echo "Index may exist"

appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key by_order \
  --type key \
  --attributes order \
  --json || echo "Index may exist"

echo "Experience Accomplishments setup completed!"