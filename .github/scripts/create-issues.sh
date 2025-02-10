#!/bin/bash

# Enable error handling
set -euo pipefail

# Check if yq is installed (used for YAML parsing)
if ! command -v yq &> /dev/null; then
    echo "yq is required but not installed. Install it with:"
    echo "brew install yq     # for macOS"
    echo "apt install yq      # for Ubuntu"
    exit 1
fi

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is required but not installed. Install it with:"
    echo "brew install gh     # for macOS"
    echo "apt install gh      # for Ubuntu"
    exit 1
fi

# Check if gh is authenticated
if ! gh auth status &> /dev/null; then
    echo "Please login to GitHub CLI first using: gh auth login"
    exit 1
fi

REPO="1trippycat/prompthub"

# Define colors for labels
declare -A LABEL_COLORS
LABEL_COLORS=(
    ["high-priority"]="B60205"
    ["medium-priority"]="D93F0B"
    ["low-priority"]="0E8A16"
    ["frontend"]="1D76DB"
    ["backend"]="0052CC"
    ["extension"]="5319E7"
    ["api"]="006B75"
    ["auth"]="FBCA04"
    ["hooks"]="0E8A16"
    ["storage"]="C2E0C6"
    ["styling"]="BFD4F2"
)

# Create all labels first
echo "Creating all labels..."
for label in "${!LABEL_COLORS[@]}"; do
    color="${LABEL_COLORS[$label]}"
    echo "Creating/updating label: $label"
    gh label create "$label" \
        --color "$color" \
        --repo "$REPO" \
        --force >/dev/null 2>&1 || echo "Warning: Failed to create label $label"
done
echo "Label creation complete"
echo "-----------------------------------"

# Function to check if issue exists
issue_exists() {
    local title="$1"
    # Search for exact title match among OPEN issues only
    local existing_issue
    existing_issue=$(gh issue list --repo "$REPO" --state open --json number,title --jq ".[] | select(.title == \"$title\") | .number" 2>/dev/null)
    if [ -n "$existing_issue" ]; then
        echo "Open issue already exists with number: $existing_issue"
        return 0
    fi
    return 1
}

# Function to create an issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    
    echo "Creating issue: $title"
    
    # Check if issue already exists
    if issue_exists "$title"; then
        echo "Skipping creation of existing issue: $title"
        return 0
    fi
    
    # Create the issue with all labels
    local issue_url
    issue_url=$(gh issue create \
        --repo "$REPO" \
        --title "$title" \
        --body "$body" \
        --label "$labels")
    
    if [ $? -ne 0 ]; then
        echo "Failed to create issue: $title"
        return 1
    fi
    
    echo "Created issue: $issue_url"
    return 0
}

# Get the total number of issues
total_issues=$(yq -r '.issues | length' issues.yml)
if [ -z "$total_issues" ]; then
    echo "Failed to get total number of issues"
    exit 1
fi

echo "Found $total_issues issues to create..."

# Process each issue
for ((i=0; i<total_issues; i++)); do
    current_issue=$((i + 1))
    echo "-----------------------------------"
    echo "Processing issue $current_issue of $total_issues"
    
    # Extract issue details
    title=$(yq -r ".issues[$i].title" issues.yml)
    file=$(yq -r ".issues[$i].file" issues.yml)
    description=$(yq -r ".issues[$i].description" issues.yml)
    acceptance_criteria=$(yq -r ".issues[$i].acceptance_criteria" issues.yml)
    implementation_notes=$(yq -r ".issues[$i].implementation_notes" issues.yml)
    
    # Get required reading as an array and format it
    required_reading=$(yq -r ".issues[$i].required_reading[]" issues.yml 2>/dev/null | while read -r line; do
        echo "- $line"
    done)
    
    # Get dependencies as an array and format it
    dependencies=$(yq -r ".issues[$i].dependencies[]" issues.yml 2>/dev/null | while read -r line; do
        echo "- $line"
    done)
    
    # Get labels as comma-separated string
    labels=$(yq -r ".issues[$i].labels | join(\",\")" issues.yml)
    
    if [ -z "$title" ] || [ -z "$labels" ]; then
        echo "Missing required fields for issue $current_issue"
        continue
    fi
    
    # Create the body of the issue
    body="# Description
$description

## Files Affected
\`$file\`

## Dependencies
${dependencies:-"None"}

## Required Reading
${required_reading:-"None"}

## Acceptance Criteria
$acceptance_criteria

## Implementation Notes
$implementation_notes"

    if ! create_issue "$title" "$body" "$labels"; then
        echo "Failed to create issue $current_issue"
        exit 1
    fi
    
    # Add a delay between issues to avoid rate limiting
    sleep 3
done

echo "-----------------------------------"
echo "All issues created successfully!"
