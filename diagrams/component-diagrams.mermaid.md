%%
---
name: component-diagrams
type: repo
agent: CodeActAgent
---
Repository: PromptHub
Description: Mermaid diagram illustrating the hierarchical structure and relationships between Chrome extension components, including the popup interface, main UI components, context providers, and service layers.
---

%%

flowchart TD
    subgraph ChromeExt[Chrome Extension Components]
        Popup[Popup Interface] --> |Opens| MainUI[Main Interface]
        MainUI --> Layout[Layout Components]
        Layout --> Header[Header]
        Layout --> Sidebar[Sidebar]
        Layout --> Content[Content Area]
        
        Content --> Editor[Prompt Editor]
        Content --> List[Prompt List]
        Content --> Template[Template Handler]
        Content --> Enhancement[LLM Enhancer]
        
        Editor --> EditorTools[Editor Tools]
        Editor --> Version[Version History]
        Editor --> Controls[Editor Controls]
        
        List --> Grid[Grid View]
        List --> Table[Table View]
        List --> Search[Search & Filter]
        
        Template --> Variables[Variable Form]
        Template --> Preview[Template Preview]
        Template --> VarList[Variable List]
        
        Enhancement --> Options[Enhancement Options]
        Enhancement --> ProviderConfig[Provider Settings]
        Enhancement --> Results[Enhancement Preview]
    end

    subgraph Context[Context Providers]
        Auth[Auth Context]
        Prompt[Prompt Context]
        Template[Template Context]
        UI[UI Context]
    end

    subgraph Services[Service Layer]
        API[API Service]
        Storage[Storage Service]
        LLM[LLM Service]
    end

    subgraph ExtCore[Extension Core]
        Background[Background Script]
        Content[Content Script]
        PageUtils[Page Utilities]
    end

    MainUI --> Context
    Content --> Services
    ExtCore --> Services

    classDef primary fill:#f9f,stroke:#333,stroke-width:2px
    classDef secondary fill:#bbf,stroke:#333,stroke-width:2px
    classDef tertiary fill:#bfb,stroke:#333,stroke-width:2px
    
    class ChromeExt,Context,Services,ExtCore primary
    class MainUI,Layout,Content secondary
    class Editor,List,Template,Enhancement tertiary