#!/bin/bash

echo "Creating Guest Book collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="guest_book"

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

# Process Guest Book Collection
echo "Creating Guest Book collection..."
create_collection $DATABASE_ID "guest_book" "Guest Book"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id guest_book \
  --key name \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-email-attribute \
  --database-id $DATABASE_ID \
  --collection-id guest_book \
  --key email \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id guest_book \
  --key message \
  --size 1000 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id guest_book \
  --key date \
  --size 50 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id guest_book \
  --key ip_address \
  --size 100 \
  --required false \
  --json || echo "Attribute may exist"

# Wait for guest book attributes to be ready
echo "Waiting for guest book attributes to be ready..."
sleep 5

# Add guest book indexes
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id guest_book \
  --key by_date \
  --type key \
  --attributes date \
  --json || echo "Index may exist"

echo "Guest Book collection created successfully!"