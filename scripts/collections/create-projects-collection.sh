#!/bin/bash

echo "Creating Projects collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="projects"

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

# Process Projects collection
create_collection $DATABASE_ID "projects" "Projects"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key name \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key description \
  --size 1000 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key longDescription \
  --size 50000 \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-url-attribute \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key image \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key category \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-url-attribute \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key github \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-url-attribute \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key live \
  --required false \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key imageId \
  --size 255 \
  --required false \
  --json || echo "Attribute may exist"

# Use our special boolean attribute creation function with extra waiting time
create_boolean_attribute() {
  local db_id=$1
  local coll_id=$2
  local key_name=$3

  echo "Creating boolean attribute: $key_name"
  
  # Create the attribute
  appwrite databases create-boolean-attribute \
    --database-id $db_id \
    --collection-id $coll_id \
    --key $key_name \
    --required true \
    --json || echo "Boolean attribute may exist"
    
  # Give it time to process
  echo "Waiting for boolean attribute $key_name to be ready..."
  sleep 5
}

create_boolean_attribute $DATABASE_ID "projects" "featured"

# Array attribute for technologies - limiting size to 36 chars per element
appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key technologies \
  --size 36 \
  --required false \
  --array true \
  --json || echo "Attribute may exist"

# Wait longer for attributes to be ready
echo "Waiting for projects attributes to be ready..."
sleep 5

# Add indexes for Projects
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key by_category \
  --type key \
  --attributes category \
  --json || echo "Index may exist or attributes not ready"

appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id projects \
  --key by_featured \
  --type key \
  --attributes featured \
  --json || echo "Index may exist or attributes not ready"

echo "Projects collection created successfully!"