#!/bin/bash

echo "Starting setup script..."

set -e

print_separator() {
    echo "------------------------------------------------------"
}

print_separator
echo "Installing Node.js dependencies..."
npm install || { echo "Failed to install Node.js dependencies. Exiting."; exit 1; }

print_separator
echo "Loading environment variables from .env..."
if [ -f ".env" ]; then
    npx dotenv -e .env -- echo "Environment variables loaded."
else
    echo ".env file not found. Make sure your environment variables are configured."
fi

print_separator
echo "Checking for Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

echo "Docker is installed. Checking Docker service..."
if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start the Docker service and try again."
    exit 1
fi

print_separator
echo "Building custom Docker images for code execution..."

DOCKER_BUILD_DIR="dockerfiles"
IMAGES=(
    "language-runner-c:Dockerfile.c"
    "language-runner-cpp:Dockerfile.cpp"
    "language-runner-python:Dockerfile.python"
    "language-runner-java:Dockerfile.java"
    "language-runner-node:Dockerfile.node"
    "language-runner-ruby:Dockerfile.ruby"
    "language-runner-perl:Dockerfile.pl"
    "language-runner-php:Dockerfile.php"
    "language-runner-swift:Dockerfile.swift"
    "language-runner-rust:Dockerfile.rust"
)

for IMAGE_AND_FILE in "${IMAGES[@]}"; do
    IMAGE="${IMAGE_AND_FILE%%:*}"
    DOCKERFILE="${IMAGE_AND_FILE##*:}"

    if [ -f "$DOCKER_BUILD_DIR/$DOCKERFILE" ]; then
        echo "Building image $IMAGE from $DOCKER_BUILD_DIR/$DOCKERFILE..."
        docker build -t "$IMAGE" -f "$DOCKER_BUILD_DIR/$DOCKERFILE" . || { echo "Failed to build $IMAGE. Exiting."; exit 1; }
    else
        echo "Dockerfile $DOCKER_BUILD_DIR/$DOCKERFILE not found. Skipping $IMAGE."
    fi
done

echo "Custom Docker images built successfully."

print_separator
echo "Checking for existing database..."
DB_PATH="server/libs/prisma/dev.db"
if [ -f "$DB_PATH" ]; then
    echo "Found existing database at $DB_PATH. Deleting it..."
    rm "$DB_PATH" || { echo "Failed to delete the database. Exiting."; exit 1; }
    echo "Database deleted."
else
    echo "No existing database found at $DB_PATH. Proceeding..."
fi

print_separator
echo "Generating Prisma client..."
if ! command -v prisma &> /dev/null; then
    echo "Prisma CLI is not installed. Installing..."
    npm install -g prisma || { echo "Failed to install Prisma CLI. Exiting."; exit 1; }
fi

prisma generate --schema=server/libs/prisma/schema.prisma || { echo "Failed to generate Prisma client. Exiting."; exit 1; }

print_separator
echo "Running Prisma migrations..."
prisma migrate deploy --schema=server/libs/prisma/schema.prisma || { echo "Failed to run Prisma migrations. Exiting."; exit 1; }

print_separator
echo "Creating admin user in the database..."
if [ -f "scripts/createAdminUser.js" ]; then
    npx node scripts/createAdminUser.js || { echo "Failed to create admin user. Exiting."; exit 1; }
else
    echo "Admin user creation script not found. Skipping this step."
fi

print_separator
echo "Populating database..."
if [ -f "scripts/populateDatabase.js" ]; then
    npx node scripts/populateDatabase.js || { echo "Failed to populate the database. Exiting."; exit 1; }
else
    echo "Database population script not found. Skipping this step."
fi

print_separator
echo "Setup complete. You can now start the server with ./run.sh"
