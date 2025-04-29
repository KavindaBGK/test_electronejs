# Test App with Plugin Interface

This is a test application built with Electron, React, and TypeScript that demonstrates a plugin interface system.

## Features

- Electron-based desktop application
- React and TypeScript for the frontend
- Plugin interface for extending functionality
- Authentication system (mock)
- Dashboard with analytics

## Plugin System

The application includes a plugin system that allows you to create and load custom plugins. Plugins can provide menu items and execute actions.

### Plugin Interface

Plugins must implement the following interface:

```typescript
interface PluginInterface {
  // Called when the plugin is activated
  activate: (context: any) => void;
  
  // Return menu items to display in the UI
  getMenuItems: () => PluginMenuItem[];
  
  // Execute an action with the given ID and parameters
  executeAction: (actionId: string, params?: any) => Promise<any>;
}
```

### Plugin Menu Items

Menu items have the following structure:

```typescript
interface PluginMenuItem {
  id: string;        // Unique identifier for the menu item
  label: string;     // Display text
  icon?: string;     // Icon name (optional)
  action?: string;   // Action ID to execute when clicked (optional)
  children?: PluginMenuItem[]; // Submenu items (optional)
}
```

### Creating a Plugin

1. Create a directory in `src/extensions/` with your plugin name
2. Create a `package.json` file with metadata about your plugin
3. Create an `index.js` file that exports the required interface functions
4. Implement the plugin functionality

See the sample plugin in `src/extensions/sample-plugin` for an example.

## Development

### Install dependencies

```
npm install
```

### Run in development mode

```
npm run dev
```

### Build for production

```
npm run build
```

## License

MIT

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
