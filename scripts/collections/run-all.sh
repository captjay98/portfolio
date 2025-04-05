#!/bin/bash

echo "Setting up Appwrite for Portfolio"

# Source environment variables
set -o allexport
source .env
set +o allexport

# Check if Appwrite CLI is installed
if ! command -v appwrite &> /dev/null
then
    echo "Appwrite CLI could not be found. Please install it first."
    exit 1
fi

# Function to execute a script and check for errors
execute_script() {
  local script_path=$1
  echo "Executing script: $script_path"
  if ! bash "$script_path"; then
    echo "Error executing script: $script_path"
    exit 1
  fi
  echo "Script executed successfully: $script_path"
}

# Create the database
execute_script "./create-appwrite-database.sh"

# Create storage buckets
execute_script "./create-storage-buckets.sh"

# Create core collections
execute_script "./collections/create-categories-collection.sh"
execute_script "./collections/create-technologies-collection.sh"
execute_script "./collections/create-skills-collection.sh"
execute_script "./collections/create-experiences-collection.sh"
execute_script "./collections/create-experience-accomplishments-collection.sh"
execute_script "./collections/create-projects-collection.sh"

execute_script "./collections/create-blog-posts-collection.sh"
execute_script "./collections/create-blog-series-collection.sh"

execute_script "./collections/create-comments-collection.sh"
execute_script "./collections/create-site-settings-collection.sh"

execute_script "./collections/create-contact-submissions-collection.sh"
execute_script "./collections/create-guest-book-collection.sh"

execute_script "./create-default-user.sh"

echo "All scripts executed successfully!"