#!/bin/bash

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

# Function to create a label if it doesn't exist
create_label() {
    local name="$1"
    local color="${LABEL_COLORS[$name]}"
    if [ -z "$color" ]; then
        color="CCCCCC"  # Default color if not specified
    fi
    
    echo "Creating/updating label: $name"
    gh label create "$name" \
        --color "$color" \
        --repo "$REPO" \
        --force || true
}

# Function to create an issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels=($3)  # Convert space-separated string to array
    
    echo "Creating issue: $title"
    
    # Create each label first
    for label in "${labels[@]}"; do
        # Remove any quotes from label
        label="${label//\"/}"
        create_label "$label"
    done
    
    # Create the issue with the first label
    local first_label="${labels[0]//\"/}"
    local issue_output=$(gh issue create \
        --repo "$REPO" \
        --title "$title" \
        --body "$body" \
        --label "$first_label" 2>&1)
    
    # Debugging: Print the output of the issue creation
    echo "Issue creation output: $issue_output"
    
    # Extract the issue number from the output
    local issue_number=$(echo "$issue_output" | grep -oE 'https://github.com/.*/issues/[0-9]+' | grep -oE '[0-9]+$')
    
    if [ -z "$issue_number" ]; then
        echo "Failed to create issue or extract issue number."
        return
    fi
    
    # Add remaining labels one at a time
    for ((i=1; i<${#labels[@]}; i++)); do
        label="${labels[i]//\"/}"
        gh issue edit "$issue_number" --add-label "$label" --repo "$REPO"
    done
    
    echo "Created issue #$issue_number"
}

# Read and process the YAML file
num_issues=$(yq '.issues | length' issues.yml)
echo "Found $num_issues issues to create..."

for ((i=0; i<$num_issues; i++)); do
    # Extract issue details, removing surrounding quotes
    title=$(yq ".issues[$i].title" issues.yml | sed 's/^"\(.*\)"$/\1/')
    file=$(yq ".issues[$i].file" issues.yml)
    description=$(yq ".issues[$i].description" issues.yml)
    acceptance_criteria=$(yq ".issues[$i].acceptance_criteria" issues.yml)
    implementation_notes=$(yq ".issues[$i].implementation_notes" issues.yml)
    
    # Get required reading as an array and format it
    required_reading=$(yq ".issues[$i].required_reading[]" issues.yml | while read -r line; do
        echo "- $line"
    done)
    
    # Get dependencies as an array and format it
    dependencies=$(yq ".issues[$i].dependencies[]" issues.yml | while read -r line; do
        echo "- $line"
    done)
    
    # Get labels as space-separated string
    labels=$(yq ".issues[$i].labels | join(\" \")" issues.yml)
    
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

    create_issue "$title" "$body" "$labels"
    
    # Add a small delay to avoid rate limiting
    sleep 2
done

echo "All issues created successfully!"
