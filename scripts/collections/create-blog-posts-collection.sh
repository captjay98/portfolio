#!/bin/bash

echo "Creating Blog Posts collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="blog_posts"

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

# Create Blog Posts Collection
echo "Creating Blog Posts collection..."
create_collection $DATABASE_ID $COLLECTION_ID "Blog Posts"

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
  --key slug \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key excerpt \
  --size 5000 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key content \
  --size 100000 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-url-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key coverImage \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key coverImageId \
  --size 255 \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key date \
  --size 50 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key readingTime \
  --size 50 \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key status \
  --size 20 \
  --required true \
  --json || echo "Attribute may exist"

# Create array attributes
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key categories \
  --size 255 \
  --required false \
  --array true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key tags \
  --size 255 \
  --required false \
  --array true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key technologies \
  --size 255 \
  --required false \
  --array true \
  --json || echo "Attribute may exist"

# Create boolean attributes
appwrite databases create-boolean-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key featured \
  --required true \
  --json || echo "Attribute may exist"

# Add series-related fields
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key series_id \
  --size 255 \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-integer-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key series_position \
  --required false \
  --min 0 \
  --max 1000 \
  --json || echo "Attribute may exist"

# Add related posts and recommended read fields
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key related_posts \
  --size 36 \
  --required false \
  --array true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key recommended_next_read \
  --size 36 \
  --required false \
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
  --key by_date \
  --type key \
  --attributes date \
  --json || echo "Index may exist"

appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key by_featured \
  --type key \
  --attributes featured \
  --json || echo "Index may exist"

appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id $COLLECTION_ID \
  --key by_status \
  --type key \
  --attributes status \
  --json || echo "Index may exist"

echo "Blog Posts collection created successfully!"