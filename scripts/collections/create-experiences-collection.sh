#!/bin/bash

echo "Creating Experiences collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="experiences"

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

# Process Experiences collection
create_collection $DATABASE_ID "experiences" "Work Experiences"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id experiences \
  --key title \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id experiences \
  --key company \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id experiences \
  --key location \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id experiences \
  --key startDate \
  --size 50 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id experiences \
  --key endDate \
  --size 50 \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id experiences \
  --key description \
  --size 10000 \
  --required true \
  --json || echo "Attribute may exist"

# For array attributes (domain_categories) - limiting size to 36 chars per element
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id experiences \
  --key domain_categories \
  --size 36 \
  --required false \
  --array true \
  --json || echo "Attribute may exist"

# For array attributes (technologies) - limiting size to 36 chars per element
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id experiences \
  --key technologies \
  --size 36 \
  --required false \
  --array true \
  --json || echo "Attribute may exist"

# Wait longer for attributes to be ready
echo "Waiting for experiences attributes to be ready..."
sleep 5

# Add index for Experiences
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id experiences \
  --key by_date \
  --type key \
  --attributes startDate \
  --json || echo "Index may exist or attributes not ready"

echo "Experiences collection created successfully!"