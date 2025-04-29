# Modern UI Extension

A VS Code extension with a modern UI featuring side navigation and multiple content sections.

## Features

- Modern side navigation panel with sleek design
- Multiple content sections (Dashboard, Forms, Settings, Help)
- Form with input fields that captures and submits data
- Responsive layout that adapts to the VS Code theme
- Animated transitions between sections

## How to Use

1. Press `F5` to run the extension in a new VS Code window
2. Open the Command Palette (Ctrl+Shift+P)
3. Type "Show Simple Form" and select the command
4. The extension UI will appear with a side navigation panel and dashboard section
5. Click on different navigation items to switch between sections
6. In the Forms section, enter text in the input fields and click Submit
7. A notification will appear with the values you entered

## Navigation Sections

- **Dashboard**: Welcome page with extension overview
- **Forms**: Input form for submitting data
- **Settings**: Configuration options for the extension
- **Help**: Documentation and resources

## Development

- This extension is built using the VS Code Extension API
- It uses webviews to display a modern UI interface
- The navigation panel allows for better organization of functionality
- Styled using CSS variables for VS Code theme integration
- Interactive elements use message passing to communicate with the extension
