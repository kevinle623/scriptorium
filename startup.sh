#!/bin/bash

echo "Installing Node.js dependencies..."
npm install

echo "Loading environment variables from .env..."
npx dotenv -e .env -- echo "Environment variables loaded."

echo "Checking for Docker installation..."
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

echo "Docker is installed. Checking Docker service..."
if ! docker info &> /dev/null
then
    echo "Docker is not running. Please start the Docker service and try again."
    exit 1
fi

echo "Pulling required Docker images for code execution..."
IMAGES=(
    "gcc:latest"
    "openjdk:latest"
    "python:3.9-slim"
    "node:16"
    "ruby:latest"
    "golang:latest"
    "php:latest"
    "swift:latest"
    "rust:latest"
)
for IMAGE in "${IMAGES[@]}"
do
    if [[ "$(docker images -q $IMAGE 2> /dev/null)" == "" ]]; then
        echo "Pulling $IMAGE..."
        docker pull $IMAGE
    else
        echo "$IMAGE already available locally."
    fi
done

echo "All required Docker images are ready."

echo "Checking for existing database..."
DB_PATH="server/libs/prisma/dev.db"
if [ -f "$DB_PATH" ]; then
    echo "Found existing database at $DB_PATH. Deleting it..."
    rm "$DB_PATH"
    echo "Database deleted."
else
    echo "No existing database found at $DB_PATH. Proceeding..."
fi

echo "Running Prisma migrations..."
prisma migrate deploy --schema=server/libs/prisma/schema.prisma

echo "Generating Prisma client..."
prisma generate --schema=server/libs/prisma/schema.prisma

echo "Building Docker container for custom setups (if applicable)..."
if [ -f "Dockerfile" ]; then
    echo "Found Dockerfile. Building custom container..."
    docker build -t custom-app:latest .
else
    echo "No Dockerfile found. Skipping custom container build."
fi

echo "Creating admin user in the database..."
npx node scripts/createAdminUser.js


echo "Populating Database.."
npx node scripts/populateDatabase.js

echo "Setup complete. You can now start the server with ./run.sh"
