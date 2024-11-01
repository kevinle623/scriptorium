echo "Installing Node.js dependencies..."
npm install

echo "Loading environment variables from .env..."
npx dotenv -e .env -- echo "Environment variables loaded."

check_installed() {
    if ! command -v $1 &> /dev/null
    then
        echo "$1 is not installed. Please install $1 to continue."
        exit 1
    fi
}

echo "Checking for required compilers and interpreters..."
check_installed gcc
check_installed g++
check_installed javac
check_installed python3
check_installed node
check_installed npx

echo "All required compilers and interpreters found in the machine! Proceeding..."

DB_PATH="server/libs/prisma/dev.db"
if [ -f "$DB_PATH" ]; then
    echo "Found existing database at $DB_PATH. Deleting it..."
    rm "$DB_PATH"
    echo "Database deleted."
else
    echo "No existing database found at $DB_PATH. Proceeding..."
fi

echo "Running Prisma migrations..."
cd server/libs || exit 1
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Creating admin user in the database..."
npx node scripts/createAdminUser.js

echo "Setup complete. You can now start the server with ./run.sh"

