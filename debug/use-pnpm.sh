#!/bin/bash
set -e

print_step() {
    printf "\n\033[1;34m==== $1 ====\033[0m\n"
}

print_step "Switching to pnpm"

# Copy pnpm-specific package.json
print_step "Copying package.pnpm.json"
cp ./debug/package.pnpm.json ./package.json

# Ensure pnpm is available
if ! command -v pnpm &> /dev/null; then
    print_step "Installing pnpm via corepack"
    corepack enable
    corepack prepare pnpm@latest --activate
fi

print_step "Removing global NPM 'cotext' installation"
npm uninstall -g cotext 2>/dev/null || true

print_step "Cleaning up node_modules and lock files"
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml

print_step "Installing dependencies with pnpm"
pnpm install

print_step "Building the package"
pnpm run build

print_step "Packing the package"
pnpm pack --pack-destination='./bin/prebuilt'

print_step "Removing old pnpm global 'cotext' installation"
pnpm remove -g cotext 2>/dev/null || true

print_step "Linking package globally"
pnpm link --global

print_step "Setting package manager indicator"
echo "pnpm" > .pm-indicator

print_step "Reset terminal instance"
source ~/.bashrc

print_step "Setup complete. Testing global command"
cotext --version

print_step "Close this terminal and open new one."

