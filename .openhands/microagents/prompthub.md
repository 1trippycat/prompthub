---
name: prompthub
type: repo
agent: CodeActAgent
---

Section: Technical Spec
Description: Comprehensive technical specification documenting the project's architecture, core features, data models, API structure, security features, and implementation considerations for both the Chrome extension frontend and Express.js backend.
---

# PromptHub Technical Specification

## Project Overview
PromptHub is a Chrome extension designed to help users manage, enhance, and organize their AI prompts across various platforms. It provides a centralized hub for prompt management with features like versioning, templates, and AI-powered enhancements.

## Core Features
1. **Prompt Management**
   - Create, edit, and delete prompts
   - Version control with history tracking
   - Categorization and tagging
   - Search and filter capabilities
   - Import/export functionality

2. **Template System**
   - Variable-based templating
   - Real-time preview
   - Variable validation
   - Template versioning
   - Quick-fill functionality

3. **LLM Integration**
   - Multiple provider support (OpenAI, Claude, etc.)
   - Prompt enhancement suggestions
   - Quality analysis
   - Auto-tagging
   - Context-aware improvements

4. **Chrome Extension Features**
   - Context menu integration
   - Input field detection
   - Quick prompt insertion
   - Site-specific configurations
   - Cross-page functionality

## Technical Architecture

### Frontend (Chrome Extension)
- **Framework**: React 18
- **State Management**: React Context + Custom Hooks
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **Animation**: Framer Motion

### Backend (Express.js Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: Google OAuth
- **API**: RESTful with JWT

### Infrastructure
- **Containerization**: Docker
- **Database**: MongoDB Container
- **Deployment**: Docker Compose
- **CI/CD**: GitHub Actions

## Security Features
- JWT-based authentication
- Rate limiting
- Input sanitization
- XSS prevention
- CORS configuration
- Secure storage handling

## Data Models

### User Model
```javascript
{
  email: String,
  name: String,
  picture: String,
  googleId: String,
  role: Enum['user', 'admin'],
  settings: {
    defaultLLMProvider: String,
    theme: String,
    promptsPerPage: Number
  }
}
```

### Prompt Model
```javascript
{
  title: String,
  content: String,
  category: String,
  tags: [String],
  llmType: String,
  promptType: String,
  userId: ObjectId,
  templateFields: [String],
  versions: [{
    content: String,
    timestamp: Date,
    enhancement: String
  }],
  isPublic: Boolean,
  usageCount: Number
}
```

## API Structure

### Authentication Endpoints
- `POST /api/auth/google`: Google OAuth login
- `GET /api/auth/me`: Get current user
- `PATCH /api/auth/settings`: Update settings
- `POST /api/auth/logout`: Logout

### Prompt Endpoints
- `GET /api/prompts`: List prompts
- `POST /api/prompts`: Create prompt
- `GET /api/prompts/:id`: Get prompt
- `PATCH /api/prompts/:id`: Update prompt
- `DELETE /api/prompts/:id`: Delete prompt
- `GET /api/prompts/:id/versions`: Get versions

### LLM Endpoints
- `POST /api/llm/enhance`: Enhance prompt
- `POST /api/llm/validate`: Validate prompt
- `POST /api/llm/auto-tag`: Generate tags
- `POST /api/llm/auto-categorize`: Suggest category

## Performance Considerations
- Client-side caching
- Rate limiting
- Lazy loading
- Code splitting
- Asset optimization
- Debounced operations
- Virtual scrolling

## Extension Integration
- Content script injection
- Background worker management
- Cross-origin messaging
- Storage optimization
- Context menu integration
- Site-specific configs

## Error Handling
- Global error boundary
- API error handling
- Validation errors
- Network errors
- Rate limit handling
- Authentication errors

## Testing Strategy
- Unit tests for components
- Integration tests for flows
- E2E tests for critical paths
- API endpoint testing
- Extension functionality testing
- Cross-browser testing

---

Section:  Project Reference 
Description: Detailed development reference guide covering implementation patterns, coding conventions, type definitions, state management approaches, testing strategies, and extension-specific considerations for AI-assisted development.
---

# PromptHub AI Development Reference

## Development Conventions

### React Component Structure
```typescript
// Component Type Definition
type ComponentProps = {
  // Props interface
};

// Component Implementation Pattern
const Component: React.FC<ComponentProps> = ({}) => {
  // State management
  // Effects
  // Helper functions
  return (
    // JSX
  );
};
```

### Styling Conventions
1. Using Tailwind CSS with shadcn/ui components
2. Custom styles in `./src/styles/components/`
3. Theme configuration in `tailwind.config.js`
4. Dark/light mode support via CSS variables

### State Management Patterns
1. Context usage for global state
2. Local state with useState
3. Complex state with useReducer
4. Custom hooks for reusable logic

### File Naming Conventions
- Components: PascalCase (e.g., `PromptEditor.tsx`)
- Hooks: camelCase (e.g., `usePrompts.ts`)
- Utilities: camelCase (e.g., `templateParser.ts`)
- Styles: kebab-case (e.g., `prompt-editor.css`)

## Key Implementation Details

### Template System
```typescript
// Template Variable Format
type TemplateVariable = {
  name: string;
  type: 'text' | 'number' | 'select';
  defaultValue?: string;
  options?: string[]; // For select type
};

// Template Structure
type Template = {
  content: string;
  variables: TemplateVariable[];
  preview: string;
};
```

### LLM Enhancement System
```typescript
// Enhancement Types
type EnhancementType = 'clarity' | 'specificity' | 'context' | 'creativity';

// Enhancement Request
type EnhancementRequest = {
  content: string;
  type: EnhancementType;
  provider: string;
  options?: Record<string, any>;
};
```

### Storage Patterns
```typescript
// Chrome Storage Structure
interface StorageSchema {
  prompts: Record<string, Prompt>;
  templates: Record<string, Template>;
  settings: UserSettings;
  cache: {
    [key: string]: {
      data: any;
      timestamp: number;
    };
  };
}
```

## Critical Paths and Dependencies

### Authentication Flow
1. Google OAuth initiation
2. Token validation
3. User profile fetch
4. Session management

### Prompt Management Flow
1. CRUD operations
2. Version control
3. Search/filter
4. Template processing

### Extension Integration Flow
1. Context menu registration
2. Content script injection
3. Message passing
4. Storage synchronization

## Error Handling Patterns

### API Errors
```typescript
type APIError = {
  code: string;
  message: string;
  details?: Record<string, any>;
};

const handleAPIError = (error: APIError) => {
  // Error handling logic
};
```

### Validation Errors
```typescript
type ValidationError = {
  field: string;
  message: string;
  type: 'required' | 'format' | 'length';
};

const validateInput = (input: any): ValidationError[] => {
  // Validation logic
};
```

## Testing Patterns

### Component Testing
```typescript
describe('Component', () => {
  it('should render correctly', () => {
    // Test logic
  });

  it('should handle user interactions', () => {
    // Test logic
  });
});
```

### Integration Testing
```typescript
describe('Feature', () => {
  it('should complete the full flow', () => {
    // Test logic
  });
});
```

## Performance Considerations

### Optimization Techniques
1. Memoization patterns
2. Lazy loading implementation
3. Debounce/throttle usage
4. Cache management

### Memory Management
1. Cleanup patterns
2. Resource disposal
3. Event listener management
4. Storage limitations

## Extension-Specific Details

### Manifest Configuration
```json
{
  "permissions": [
    "storage",
    "contextMenus",
    "activeTab"
  ],
  "host_permissions": [
    "*://*/*"
  ],
  "background": {
    "service_worker": "background.js"
  }
}
```

### Message Passing Patterns
```typescript
// Message Types
type MessageType = 
  | 'SAVE_PROMPT'
  | 'LOAD_TEMPLATE'
  | 'ENHANCE_PROMPT'
  | 'UPDATE_SETTINGS';

// Message Structure
interface ExtensionMessage {
  type: MessageType;
  payload: any;
}
```

## Development Guidelines

### Code Organization
1. Feature-based directory structure
2. Shared utilities and hooks
3. Component composition patterns
4. Service layer organization

### State Management Rules
1. Context usage criteria
2. Local vs. global state
3. Derived state patterns
4. State update batching

### Component Design Rules
1. Composition over inheritance
2. Props interface definitions
3. Event handling patterns
4. Lifecycle management

### Extension Guidelines
1. Permission usage
2. Security considerations
3. Performance optimization
4. Cross-browser compatibility

## Deployment Considerations

### Extension Packaging
1. Asset optimization
2. Code splitting
3. Manifest preparation
4. Version management

### Security Measures
1. CSP configuration
2. XSS prevention
3. CORS handling
4. Data sanitization

### Performance Requirements
1. Load time targets
2. Memory usage limits
3. Storage quotas
4. API rate limits

## Feature Flags and Configuration
```typescript
interface FeatureFlags {
  enableEnhancement: boolean;
  enableTemplates: boolean;
  enableCollaboration: boolean;
  enableAdvancedSearch: boolean;
}

interface Configuration {
  apiEndpoints: Record<string, string>;
  cacheTimeout: number;
  maxPromptLength: number;
  maxTemplateVariables: number;
}
```

This reference guide provides the essential context for an AI to understand:
1. Project structure and conventions
2. Implementation patterns and decisions
3. Critical paths and dependencies
4. Testing and optimization approaches
5. Extension-specific considerations

----

---
name: project-tree-docs
type: repo
agent: CodeActAgent
---
Section: Project Tree 
Description: Detailed documentation of the project's file structure and organization, including comprehensive descriptions of all components, hooks, services, and utilities. Contains component-by-component breakdown with descriptions of their purposes, hierarchical organization of the source directory, and explanations of key features for each major system component. Includes detailed categorization of UI components, context providers, and extension integration points.
---

# PromptHub Project Tree Documentation

## Source Directory (`./src/`)

### Components (`./src/components/`)

#### Layout Components (`./src/components/layout/`)
```
├── Header.jsx              # Main navigation header, includes user profile and settings
├── Sidebar.jsx            # Left navigation panel with categories and filters
├── Footer.jsx             # Application footer with version info and links
└── EditorLayout.jsx       # Layout wrapper for the prompt editor interface
```

#### Prompt Components (`./src/components/prompt/`)

##### Editor (`./src/components/prompt/editor/`)
```
├── PromptEditor.jsx       # Main prompt editing interface
├── EditorToolbar.jsx      # Formatting and action toolbar for editor
├── VersionHistory.jsx     # Version history panel showing previous edits
└── EditorControls.jsx     # Save, cancel, and other editor control buttons
```

##### List (`./src/components/prompt/list/`)
```
├── PromptList.jsx         # Main container for displaying prompts
├── PromptCard.jsx         # Individual prompt display card
├── PromptGrid.jsx         # Grid layout view for prompts
├── PromptTable.jsx        # Table layout view for prompts
└── ListControls.jsx       # Controls for sorting, filtering, and view options
```

##### Template (`./src/components/prompt/template/`)
```
├── TemplateHandler.jsx    # Main template processing component
├── VariableForm.jsx       # Form for entering template variables
├── TemplatePreviewer.jsx  # Preview component for template with variables
└── VariableList.jsx       # List of available template variables
```

##### Enhancement (`./src/components/prompt/enhancement/`)
```
├── LLMEnhancer.jsx        # Main LLM enhancement interface
├── EnhancementOptions.jsx # Options for different types of enhancements
├── EnhancementPreview.jsx # Preview of enhanced prompt results
└── ProviderSettings.jsx   # LLM provider configuration options
```

#### UI Components (`./src/components/ui/`)

##### Alert Components (`./src/components/ui/alert/`)
```
├── Alert.jsx             # Reusable alert component
└── AlertProvider.jsx     # Context provider for alert system
```

##### Button Components (`./src/components/ui/button/`)
```
├── Button.jsx            # Base button component
└── IconButton.jsx        # Button component with icon support
```

##### Card Components (`./src/components/ui/card/`)
```
├── Card.jsx             # Base card container component
└── CardContent.jsx      # Inner content component for cards
```

##### Dialog Components (`./src/components/ui/dialog/`)
```
├── Dialog.jsx           # Modal dialog container
└── DialogContent.jsx    # Content wrapper for dialogs
```

##### Select Components (`./src/components/ui/select/`)
```
├── Select.jsx           # Dropdown select component
└── SelectItem.jsx       # Individual select option item
```

##### Tabs Components (`./src/components/ui/tabs/`)
```
├── Tabs.jsx            # Tab container component
└── TabPanel.jsx        # Individual tab panel content
```

### Contexts (`./src/contexts/`)
```
├── AuthContext.jsx      # Authentication state management
├── PromptContext.jsx    # Prompt data and operations management
├── TemplateContext.jsx  # Template processing state management
└── UIContext.jsx        # UI state management (theme, layout, etc.)
```

### Hooks (`./src/hooks/`)

#### Authentication (`./src/hooks/auth/`)
```
├── useAuth.js           # Authentication state and operations
└── usePermissions.js    # Permission checking and validation
```

#### Prompt (`./src/hooks/prompt/`)
```
├── usePrompts.js        # Prompt CRUD operations
└── useVersions.js       # Version history management
```

#### Template (`./src/hooks/template/`)
```
├── useTemplates.js      # Template processing operations
└── useVariables.js      # Template variable management
```

#### LLM (`./src/hooks/llm/`)
```
├── useLLM.js           # LLM integration operations
└── useEnhancement.js    # Enhancement processing
```

### Extension (`./src/extension/`)

#### Background (`./src/extension/background/`)
```
└── background.js       # Chrome extension background script
```

#### Content (`./src/extension/content/`)
```
├── contentScript.js    # Page injection and interaction script
└── pageUtils.js        # Utilities for page manipulation
```

### Services (`./src/services/`)

#### API (`./src/services/api/`)
```
├── promptApi.js        # Prompt-related API calls
├── authApi.js         # Authentication API calls
└── llmApi.js          # LLM-related API calls
```

#### Storage (`./src/services/storage/`)
```
└── chromeStorage.js    # Chrome storage service wrapper
```

#### Utils (`./src/services/utils/`)
```
├── templateParser.js   # Template parsing utilities
├── promptValidator.js  # Prompt validation utilities
└── enhancementUtils.js # Enhancement processing utilities
```

### Styles (`./src/styles/`)

#### Components (`./src/styles/components/`)
```
├── editor.css         # Editor-specific styles
├── prompt.css        # Prompt component styles
└── template.css      # Template component styles
```

#### Themes (`./src/styles/themes/`)
```
├── light.css         # Light theme definitions
└── dark.css          # Dark theme definitions
```

## Root Files
```
├── manifest.json     # Chrome extension manifest
├── tailwind.config.js # Tailwind CSS configuration
├── package.json     # Project dependencies and scripts
└── vite.config.js   # Vite bundler configuration
```

## Key Features by Component

### Core Components
- **PromptEditor**: Rich text editing with syntax highlighting and template support
- **PromptList**: Filterable, searchable list of prompts with multiple view options
- **TemplateHandler**: Variable extraction, validation, and preview rendering
- **LLMEnhancer**: Integration with various LLM providers for prompt enhancement

### UI Components
- **Alert**: Toast notifications and status messages
- **Dialog**: Modal windows for confirmations and forms
- **Card**: Consistent container styling
- **Select**: Dropdown menus with search and filtering
- **Tabs**: Content organization and navigation

### Context Providers
- **AuthContext**: User authentication state and operations
- **PromptContext**: Prompt data management and operations
- **TemplateContext**: Template processing and variable management
- **UIContext**: Theme and layout preferences

### Services
- **API Services**: Backend communication layer
- **Storage Service**: Chrome extension storage management
- **Utils**: Shared utility functions for validation and processing

### Extension Integration
- **Background Script**: Extension lifecycle management
- **Content Script**: Page integration and manipulation
- **Page Utils**: DOM interaction utilities