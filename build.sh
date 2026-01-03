#!/bin/bash
# Build script for YouTube Shorts Redirect Firefox extension
# Creates a distributable .xpi file

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building YouTube Shorts Redirect extension...${NC}"

# Get version from manifest.json
VERSION=$(grep -oP '"version":\s*"\K[^"]+' manifest.json)
echo -e "${YELLOW}Version: ${VERSION}${NC}"

# Output filename
OUTPUT_FILE="yt-unshort-${VERSION}.xpi"

# Clean up old builds
if [ -f "$OUTPUT_FILE" ]; then
    echo -e "${YELLOW}Removing old build: ${OUTPUT_FILE}${NC}"
    rm "$OUTPUT_FILE"
fi

# Files to include in the extension
FILES=(
    "manifest.json"
    "rules.json"
    "content.js"
    "icons/icon-16.png"
    "icons/icon-48.png"
    "icons/icon-128.png"
    "README.md"
    "LICENSE"
    "PRIVACY.md"
)

# Check that all required files exist
echo -e "${YELLOW}Checking required files...${NC}"
for file in "${FILES[@]}"; do
    if [ ! -f "$file" ] && [ ! -d "$file" ]; then
        echo -e "${RED}Error: Required file missing: ${file}${NC}"
        exit 1
    fi
    echo "  ✓ $file"
done

# Create the .xpi file (which is just a ZIP file with a different extension)
echo -e "${YELLOW}Creating .xpi package...${NC}"
zip -r -FS "$OUTPUT_FILE" "${FILES[@]}" -x "*.DS_Store" "*.git*"

# Verify the archive was created
if [ -f "$OUTPUT_FILE" ]; then
    SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
    echo -e "${GREEN}✓ Build successful!${NC}"
    echo -e "${GREEN}✓ Created: ${OUTPUT_FILE} (${SIZE})${NC}"
    echo ""
    echo -e "${YELLOW}To test the extension:${NC}"
    echo "  1. Open Firefox"
    echo "  2. Navigate to about:debugging#/runtime/this-firefox"
    echo "  3. Click 'Load Temporary Add-on'"
    echo "  4. Select the .xpi file: ${OUTPUT_FILE}"
    echo ""
    echo -e "${YELLOW}To distribute:${NC}"
    echo "  - Upload ${OUTPUT_FILE} to GitHub releases"
    echo "  - Or submit to https://addons.mozilla.org/"
else
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi
