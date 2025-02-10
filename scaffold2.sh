#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="./src"

# Function to create a React component
create_component() {
    local file=$1
    local name=$(basename "$file" .jsx)
    echo "import React from 'react';

const ${name} = () => {
  return (
    <div>
      {/* TODO: Implement ${name} */}
    </div>
  );
};

export default ${name};" > "$file"
}

# Function to create a hook
create_hook() {
    local file=$1
    local name=$(basename "$file" .js)
    echo "import { useState } from 'react';

const ${name} = () => {
  // TODO: Implement ${name}
  
  return {
    // Add hook return values
  };
};

export default ${name};" > "$file"
}

# Function to create a context
create_context() {
    local file=$1
    local name=$(basename "$file" .jsx | sed 's/Context//')
    echo "import React, { createContext, useContext, useState } from 'react';

const ${name}Context = createContext();

export const ${name}Provider = ({ children }) => {
  // TODO: Implement context provider

  const value = {
    // Add context values
  };

  return (
    <${name}Context.Provider value={value}>
      {children}
    <${name}Context.Provider>
  );
};

export const use${name} = () => {
  const context = useContext(${name}Context);
  if (context === undefined) {
    throw new Error('use${name} must be used within a ${name}Provider');
  }
  return context;
};" > "$file"
}

# Function to create a service
create_service() {
    local file=$1
    local name=$(basename "$file" .js)
    echo "// TODO: Implement ${name}

export const ${name} = {
  // Add service methods
};" > "$file"
}

# Function to create a style file
create_style() {
    local file=$1
    echo "/* TODO: Add styles */" > "$file"
}

# Function to create a file based on type
create_file() {
    local filepath=$1
    local type=$2
    local dir=$(dirname "$filepath")

    # Create directory if it doesn't exist
    mkdir -p "$dir"

    case $type in
        "component")
            create_component "$filepath"
            ;;
        "hook")
            create_hook "$filepath"
            ;;
        "context")
            create_context "$filepath"
            ;;
        "service")
            create_service "$filepath"
            ;;
        "style")
            create_style "$filepath"
            ;;
    esac

    echo -e "${GREEN}Created:${NC} $filepath"
}

echo -e "${BLUE}Starting scaffolding...${NC}"

# Create component directories and files
mkdir -p "$BASE_DIR/components/layout"
mkdir -p "$BASE_DIR/components/prompt/editor"
mkdir -p "$BASE_DIR/components/prompt/list"
mkdir -p "$BASE_DIR/components/prompt/template"
mkdir -p "$BASE_DIR/components/prompt/enhancement"
mkdir -p "$BASE_DIR/components/ui/alert"
mkdir -p "$BASE_DIR/components/ui/button"
mkdir -p "$BASE_DIR/components/ui/card"
mkdir -p "$BASE_DIR/components/ui/dialog"
mkdir -p "$BASE_DIR/components/ui/select"
mkdir -p "$BASE_DIR/components/ui/tabs"

# Create layout components
create_file "$BASE_DIR/components/layout/EditorLayout.jsx" "component"

# Create prompt editor components
create_file "$BASE_DIR/components/prompt/editor/EditorToolbar.jsx" "component"
create_file "$BASE_DIR/components/prompt/editor/VersionHistory.jsx" "component"
create_file "$BASE_DIR/components/prompt/editor/EditorControls.jsx" "component"

# Create prompt list components
create_file "$BASE_DIR/components/prompt/list/PromptCard.jsx" "component"
create_file "$BASE_DIR/components/prompt/list/PromptGrid.jsx" "component"
create_file "$BASE_DIR/components/prompt/list/PromptTable.jsx" "component"
create_file "$BASE_DIR/components/prompt/list/ListControls.jsx" "component"

# Create template components
create_file "$BASE_DIR/components/prompt/template/VariableForm.jsx" "component"
create_file "$BASE_DIR/components/prompt/template/TemplatePreviewer.jsx" "component"
create_file "$BASE_DIR/components/prompt/template/VariableList.jsx" "component"

# Create enhancement components
create_file "$BASE_DIR/components/prompt/enhancement/EnhancementOptions.jsx" "component"
create_file "$BASE_DIR/components/prompt/enhancement/EnhancementPreview.jsx" "component"
create_file "$BASE_DIR/components/prompt/enhancement/ProviderSettings.jsx" "component"

# Create UI components
create_file "$BASE_DIR/components/ui/alert/Alert.jsx" "component"
create_file "$BASE_DIR/components/ui/alert/AlertProvider.jsx" "component"
create_file "$BASE_DIR/components/ui/button/IconButton.jsx" "component"
create_file "$BASE_DIR/components/ui/card/CardContent.jsx" "component"
create_file "$BASE_DIR/components/ui/dialog/DialogContent.jsx" "component"
create_file "$BASE_DIR/components/ui/select/SelectItem.jsx" "component"
create_file "$BASE_DIR/components/ui/tabs/TabPanel.jsx" "component"

# Create contexts
mkdir -p "$BASE_DIR/contexts"
create_file "$BASE_DIR/contexts/AuthContext.jsx" "context"
create_file "$BASE_DIR/contexts/PromptContext.jsx" "context"
create_file "$BASE_DIR/contexts/TemplateContext.jsx" "context"
create_file "$BASE_DIR/contexts/UIContext.jsx" "context"

# Create hooks
mkdir -p "$BASE_DIR/hooks/auth"
mkdir -p "$BASE_DIR/hooks/prompt"
mkdir -p "$BASE_DIR/hooks/template"
mkdir -p "$BASE_DIR/hooks/llm"

create_file "$BASE_DIR/hooks/auth/usePermissions.js" "hook"
create_file "$BASE_DIR/hooks/prompt/useVersions.js" "hook"
create_file "$BASE_DIR/hooks/template/useVariables.js" "hook"
create_file "$BASE_DIR/hooks/llm/useEnhancement.js" "hook"

# Create extension files
mkdir -p "$BASE_DIR/extension/background"
mkdir -p "$BASE_DIR/extension/content"

create_file "$BASE_DIR/extension/background/background.js" "service"
create_file "$BASE_DIR/extension/content/contentScript.js" "service"
create_file "$BASE_DIR/extension/content/pageUtils.js" "service"

# Create services
mkdir -p "$BASE_DIR/services/api"
mkdir -p "$BASE_DIR/services/storage"
mkdir -p "$BASE_DIR/services/utils"

create_file "$BASE_DIR/services/api/promptApi.js" "service"
create_file "$BASE_DIR/services/api/authApi.js" "service"
create_file "$BASE_DIR/services/api/llmApi.js" "service"
create_file "$BASE_DIR/services/storage/chromeStorage.js" "service"
create_file "$BASE_DIR/services/utils/promptValidator.js" "service"
create_file "$BASE_DIR/services/utils/enhancementUtils.js" "service"

# Create styles
mkdir -p "$BASE_DIR/styles/components"
mkdir -p "$BASE_DIR/styles/themes"

create_file "$BASE_DIR/styles/components/editor.css" "style"
create_file "$BASE_DIR/styles/components/prompt.css" "style"
create_file "$BASE_DIR/styles/components/template.css" "style"
create_file "$BASE_DIR/styles/themes/light.css" "style"
create_file "$BASE_DIR/styles/themes/dark.css" "style"

echo -e "${GREEN}Scaffolding complete!${NC}"
