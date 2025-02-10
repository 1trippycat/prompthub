#!/bin/bash

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is required but not installed. Install it with:"
    echo "brew install gh     # for macOS"
    echo "apt install gh      # for Ubuntu"
    exit 1
fi

# Check if yq is installed
if ! command -v yq &> /dev/null; then
    echo "yq is required but not installed. Install it with:"
    echo "brew install yq     # for macOS"
    echo "apt install yq      # for Ubuntu"
    exit 1
fi

# Get the absolute path of the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO="1trippycat/prompthub"
ISSUES_FILE="$SCRIPT_DIR/issues.yml"

# Check if issues file exists
if [ ! -f "$ISSUES_FILE" ]; then
    echo "Issues file not found: $ISSUES_FILE"
    exit 1
fi

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

# Function to add labels to an issue
add_labels_to_issue() {
    local title="$1"
    local labels=($2)  # Convert space-separated string to array
    
    echo "Processing issue: $title"
    
    # Create each label first
    for label in "${labels[@]}"; do
        create_label "$label"
    done
    
    # Find issue number by title
    local issue_number=$(gh issue list --repo "$REPO" --json number,title \
        --jq ".[] | select(.title==\"$title\") | .number")
    
    if [ -z "$issue_number" ]; then
        echo "Could not find issue with title: $title"
        return 1
    fi
    
    echo "Found issue #$issue_number"
    
    # Add each label
    for label in "${labels[@]}"; do
        echo "Adding label '$label' to issue #$issue_number"
        gh issue edit "$issue_number" --add-label "$label" --repo "$REPO"
    done
    
    # Add a small delay to avoid rate limiting
    sleep 1
}

echo "Using issues file: $ISSUES_FILE"

# Process each issue from the YAML file
num_issues=$(yq '.issues | length' "$ISSUES_FILE")
echo "Found $num_issues issues to process..."

if [ "$num_issues" -gt 0 ]; then
    for ((i=0; i<num_issues; i++)); do
        title=$(yq ".issues[$i].title" "$ISSUES_FILE")
        labels=$(yq ".issues[$i].labels | join(\" \")" "$ISSUES_FILE")
        
        if add_labels_to_issue "$title" "$labels"; then
            echo "Successfully added labels to issue: $title"
        else
            echo "Failed to process issue: $title"
        fi
    done
else
    echo "No issues found in $ISSUES_FILE"
fi

echo "Label backfill complete!"
