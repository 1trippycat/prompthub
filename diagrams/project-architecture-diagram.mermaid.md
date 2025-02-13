%%
---
name: project-architecture-diagram
type: repo
agent: CodeActAgent
---
Repository: PromptHub
Description: High-level Mermaid diagram illustrating the project's architectural components and their interactions, including the Chrome extension frontend, state management, extension layer, and backend services, with clear visualization of data flow and system integration points.
---
%%


graph TB
    subgraph Frontend[Frontend - Chrome Extension]
        React[React Components]
        Hooks[Custom Hooks]
        Context[Context Providers]
        UI[UI Components]
        Extension[Extension Integration]
        
        React --> |Uses| Hooks
        React --> |Uses| Context
        React --> |Uses| UI
        React --> |Uses| Extension
    end

    subgraph Backend[Backend - Express.js Server]
        Server[Express Server]
        Auth[Authentication]
        Routes[API Routes]
        Services[Services Layer]
        Models[Data Models]
        
        Server --> |Uses| Auth
        Server --> |Uses| Routes
        Routes --> |Uses| Services
        Services --> |Uses| Models
    end

    subgraph Infrastructure[Infrastructure]
        Docker[Docker Container]
        MongoDB[MongoDB Database]
        OAuth[Google OAuth]
        
        Docker --> |Hosts| Backend
        Backend --> |Uses| MongoDB
        Auth --> |Uses| OAuth
    end

    classDef complete fill:#90EE90,stroke:#333,stroke-width:2px;
    classDef inProgress fill:#FFD700,stroke:#333,stroke-width:2px;
    classDef pending fill:#FA8072,stroke:#333,stroke-width:2px;

    %% Completed Components
    class Models,Auth,Server,Routes,Services complete;
    %% In Progress Components
    class React,Hooks,Context,UI inProgress;
    %% Pending Components
    class Extension,Docker pending;