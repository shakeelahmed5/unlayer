# Architecture Documentation

## SOLID Principles Implementation

This codebase has been refactored to follow SOLID principles, making it more maintainable, testable, and extensible.

### 1. Single Responsibility Principle (SRP)

Each component has a single, well-defined responsibility:

- **Header.svelte**: Displays the application title and editor status
- **Toolbar.svelte**: Handles action buttons (Load, Export, Reset)
- **ErrorBanner.svelte**: Displays error messages with dismiss functionality
- **EditorContainer.svelte**: Manages the Unlayer editor wrapper and loading state
- **ExportModal.svelte**: Handles HTML export display and actions
- **PreviewModal.svelte**: Displays email preview in iframe
- **Toast.svelte**: Shows notification messages

### 2. Open/Closed Principle (OCP)

Components are open for extension but closed for modification:

- **Composables**: `useEditor.ts` and `useModals.ts` can be extended with new functionality
- **Components**: Can be extended through props and events without modifying core logic
- **Event System**: Components communicate through well-defined event interfaces

### 3. Liskov Substitution Principle (LSP)

Components can be substituted without breaking functionality:

- **Modal Components**: Both ExportModal and PreviewModal follow the same interface pattern
- **Composables**: Can be swapped or extended without breaking consumers

### 4. Interface Segregation Principle (ISP)

Interfaces are focused and specific:

- **useEditor.ts**: Only exposes editor-related functionality
- **useModals.ts**: Only handles modal state management
- **Component Props**: Each component only receives the props it needs

### 5. Dependency Inversion Principle (DIP)

High-level modules don't depend on low-level modules:

- **Composables**: Abstract business logic from UI components
- **Event System**: Components communicate through events, not direct dependencies
- **Store Pattern**: State management is abstracted through Svelte stores

## Component Architecture

```
src/
├── lib/
│   ├── components/           # UI Components
│   │   ├── Header.svelte
│   │   ├── Toolbar.svelte
│   │   ├── ErrorBanner.svelte
│   │   ├── EditorContainer.svelte
│   │   ├── ExportModal.svelte
│   │   ├── PreviewModal.svelte
│   │   └── Toast.svelte
│   ├── composables/          # Business Logic
│   │   ├── useEditor.ts
│   │   └── useModals.ts
│   ├── types.ts              # Type Definitions
│   └── index.ts              # Barrel Exports
└── App.svelte                # Main Application
```

## Key Benefits

### 1. **Maintainability**
- Each component is focused and easy to understand
- Changes to one component don't affect others
- Clear separation of concerns

### 2. **Testability**
- Components can be tested in isolation
- Business logic is separated from UI
- Mock dependencies easily

### 3. **Reusability**
- Components can be reused across different contexts
- Composables can be shared between components
- Clear interfaces make integration easy

### 4. **Scalability**
- Easy to add new features without breaking existing code
- Clear patterns for extending functionality
- Modular architecture supports team development

## Usage Examples

### Using Components
```svelte
<script>
  import { Header, Toolbar, ErrorBanner } from './lib';
</script>

<Header />
<Toolbar on:export-html={handleExport} />
<ErrorBanner />
```

### Using Composables
```typescript
import { useEditor, useModals } from './lib';

const { isEditorReady, loadSampleDesign } = useEditor;
const { openExportModal } = useModals;
```

### Event Communication
```svelte
<!-- Parent Component -->
<Toolbar on:export-html={handleExport} />

<!-- Child Component -->
<script>
  const dispatch = createEventDispatcher();
  dispatch('export-html', { result });
</script>
```

## State Management

The application uses Svelte stores for state management:

- **Reactive**: State changes automatically update UI
- **Centralized**: Single source of truth for each concern
- **Composable**: Stores can be combined and extended
- **Type-safe**: Full TypeScript support

## Future Enhancements

This architecture supports easy addition of:

- New editor features
- Additional modal types
- Different editor backends
- Enhanced error handling
- Analytics integration
- Theme customization
