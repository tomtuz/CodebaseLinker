#!/bin/bash
set -e

print_step() {
    printf "\n\033[1;34m==== $1 ====\033[0m\n"
}

print_step "Switching to npm"

# Copy npm-specific package.json
print_step "Copying package.npm.json"
cp ./debug/package.npm.json ./package.json

print_step "Removing global pnpm 'cotext' installation"
corepack disable || true
pnpm un -g cotext 2>/dev/null || true

print_step "Cleaning up node_modules and lock files"
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml

print_step "Installing dependencies with npm"
npm install

print_step "Building the package"
npm run build

print_step "Packing the package"
npm pack --pack-destination='./bin/prebuilt'

print_step "Removing old npm global 'cotext' installation"
npm uninstall -g cotext 2>/dev/null || true

print_step "Installing package globally"
npm install -g ./bin/prebuilt/cotext-1.0.0.tgz

print_step "Setting package manager indicator"
echo "npm" > .pm-indicator

print_step "Reset terminal instance"
source ~/.bashrc

print_step "Setup complete. Testing global command"
cotext --version

print_step "Close this terminal and open new one."

