#!/bin/bash

echo "Creating Contact Submissions collection for Portfolio"

# Set up variables
DATABASE_ID="portfolio"
COLLECTION_ID="contact_submissions"

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

# Process Contact Submissions Collection
echo "Creating Contact Submissions collection..."
create_collection $DATABASE_ID "contact_submissions" "Contact Submissions"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id contact_submissions \
  --key name \
  --size 255 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-email-attribute \
  --database-id $DATABASE_ID \
  --collection-id contact_submissions \
  --key email \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id contact_submissions \
  --key subject \
  --size 500 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id contact_submissions \
  --key message \
  --size 10000 \
  --required true \
  --json || echo "Attribute may exist"

appwrite databases create-string-attribute \
  --database-id $DATABASE_ID \
  --collection-id contact_submissions \
  --key date \
  --size 50 \
  --required true \
  --json || echo "Attribute may exist"


# Wait for contact submissions attributes to be ready
echo "Waiting for contact submissions attributes to be ready..."
sleep 5

# Add contact submissions indexes
appwrite databases create-index \
  --database-id $DATABASE_ID \
  --collection-id contact_submissions \
  --key by_date \
  --type key \
  --attributes date \
  --json || echo "Index may exist"

echo "Contact Submissions collection created successfully!"