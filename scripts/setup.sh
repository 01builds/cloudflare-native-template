#!/bin/bash
set -e

echo "Setting up local environment..."
if [ ! -f .dev.vars ]; then
  cp .dev.vars.example .dev.vars
  echo "Created .dev.vars from example template."
fi

echo "Installing workspace dependencies..."
pnpm install

echo "Generating Drizzle migrations..."
pnpm db:generate

echo "Applying migrations to local D1 instance..."
pnpm db:migrate:local

echo "Seeding local database..."
pnpm seed

echo "Environment setup complete!"
