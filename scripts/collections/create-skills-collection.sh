#!/bin/bash

echo "Creating Skills collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="skills"

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

# Process Skills collection
create_collection $DATABASE_ID "skills" "Skills"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id skills \
  --key name \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id skills \
  --key domain_category_id \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id skills \
  --key technology_id \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id skills \
  --key level \
  --size 100 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-float-attribute \
  --database-id $DATABASE_ID \
  --collection-id skills \
  --key years \
  --required true \
  --min 0 \
  --max 50 \
  --json || echo "Attribute may exist"

# Wait longer to ensure attributes are ready
echo "Waiting for skills attributes to be ready..."
sleep 5

# Add indexes for Skills
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id skills \
  --key by_domain \
  --type key \
  --attributes domain_category_id \
  --json || echo "Index may exist or attributes not ready"

appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id skills \
  --key by_technology \
  --type key \
  --attributes technology_id \
  --json || echo "Index may exist or attributes not ready"

echo "Skills collection created successfully!"