#!/bin/bash

echo "Creating Appwrite storage buckets for portfolio"

PROJECT_ID="portfolio"

# Create bucket for project images
appwrite storage create-bucket \
  --bucket-id 'portfolio_images' \
  --name 'Portfolio Images' \
  --permissions 'read("any")' 'write("users")' \
  --file-security false \
  --enabled true --json \
  || echo "Bucket may already exist"

# Add a bucket for blog images (unless you want to use the same bucket)
appwrite storage create-bucket \
  --bucket-id 'blog_images' \
  --name 'Blog Images' \
  --permissions 'read("any")' 'write("users")' \
  --file-security false \
  --enabled true --json \
  || echo "Bucket may already exist"

echo "Storage buckets created successfully!"
