#!/usr/bin/env bash
# Usage: ./scripts/build-plugin.sh <plugin-id>
# Builds the plugin ZIP and prints its SHA256.
# Requires: zip, sha256sum (or shasum on macOS), node/npm for TypeScript plugins.
set -euo pipefail

PLUGIN_ID="$1"
PLUGIN_DIR="plugins/$PLUGIN_ID"

if [ ! -d "$PLUGIN_DIR" ]; then
  echo "Error: plugin directory '$PLUGIN_DIR' not found." >&2
  exit 1
fi

cd "$PLUGIN_DIR"

# Build TypeScript plugins
if [ -f "package.json" ]; then
  echo "Installing dependencies..."
  npm ci --prefer-offline --no-audit 2>/dev/null || npm install --no-audit
  echo "Building..."
  npm run build
fi

# Collect files to include in the ZIP
# Always: manifest.json, README.md, LICENSE, dist/
# Exclude: src/, node_modules/, *.zip, package*.json, tsconfig*, build.mjs
ZIP_NAME="${PLUGIN_ID}.zip"
rm -f "$ZIP_NAME"

FILES=()
[ -f "manifest.json" ] && FILES+=("manifest.json")
[ -d "dist" ] && FILES+=("dist/")
[ -f "README.md" ] && FILES+=("README.md")
[ -f "LICENSE" ] && FILES+=("LICENSE")

if [ ${#FILES[@]} -eq 0 ]; then
  echo "Error: no files found to include in ZIP." >&2
  exit 1
fi

zip -r "$ZIP_NAME" "${FILES[@]}"

# Compute SHA256 (cross-platform: sha256sum on Linux, shasum on macOS)
if command -v sha256sum >/dev/null 2>&1; then
  SHA256=$(sha256sum "$ZIP_NAME" | cut -d' ' -f1)
else
  SHA256=$(shasum -a 256 "$ZIP_NAME" | cut -d' ' -f1)
fi

echo ""
echo "Built: $PLUGIN_DIR/$ZIP_NAME"
echo "SHA256: $SHA256"
echo ""
echo "Update plugins.json entry:"
echo "  \"sha256\": \"$SHA256\""
