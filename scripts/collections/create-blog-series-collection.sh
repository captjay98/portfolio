#!/bin/bash

echo "Creating Blog Series collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="blog_series"

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

# Process Blog Series Collection
echo "Creating Blog Series collection..."
create_collection $DATABASE_ID $COLLECTION_ID "Blog Series"

# Create string attributes
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key title \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key description \
  --size 5000 \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key slug \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key image \
  --size 1000 \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key imageId \
  --size 255 \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-enum-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key status \
  --size 1000 \
  --required true \
  --json || echo "Attribute may exist"

# Wait for attributes to be ready
echo "Waiting for attributes to be ready..."
sleep 5

# Create indexes
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key unique_slug \
  --type unique \
  --attributes slug \
  --json || echo "Index may exist"

appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key by_status \
  --type key \
  --attributes status \
  --json || echo "Index may exist"

echo "Blog Series collection created successfully!"