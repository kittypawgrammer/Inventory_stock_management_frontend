# Inventory Stock Management

Frontend-only inventory and stock management application built with Angular 17, TypeScript, RxJS, and Tailwind CSS.

The application is organized into lazy-loaded feature modules for the dashboard, products, categories, and suppliers. Product workflows include reactive-form validation, stock adjustment, search, filters, pagination, and stock-status alerts.

## Current Data Source

The frontend currently uses local mock data and in-memory RxJS state. There is no backend or database required to run the project. Services are kept as the integration boundary for replacing mock data with an API later.

## Prerequisites

Install the following before setup:

- Node.js 18.13 or newer
- npm 9 or newer
- A modern browser
- Google Chrome is required for the default Karma unit-test launcher

Check your installed versions:

```bash
node --version
npm --version
```

## Installation and Setup

1. Clone the repository and open the project directory:

	```bash
	git clone <repository-url>
	cd inventory_stock_management
	```

2. Install the project dependencies:

	```bash
	npm install
	```

3. Confirm Tailwind CSS is available through the installed dependencies. Tailwind is configured in `tailwind.config.js`, and global directives are loaded from `src/styles.css`.

4. Start the development server:

	```bash
	npm start
	```

5. Open `http://localhost:4200/` in a browser. The default route redirects to the dashboard.

The development server reloads automatically when source files change.

## Available Commands

| Command | Description |
| --- | --- |
| `npm start` | Start the development server at `http://localhost:4200/` |
| `npm run build` | Create a production build in `dist/` |
| `npm run watch` | Rebuild continuously using the development configuration |
| `npm test` | Run Angular unit tests with Karma |
| `npx ng generate component <name>` | Generate an Angular component |
| `npx ng generate module <name>` | Generate an Angular NgModule |

For Angular CLI commands, use workspace-relative paths without a leading slash. For example:

```bash
npx ng generate module core/state
```

## Application Routes

- `/dashboard` - Inventory summary and stock alerts
- `/products` - Product list, search, filters, pagination, and actions
- `/products/new` - Add a product
- `/products/:id/edit` - Edit a product
- `/categories` - Category management
- `/suppliers` - Supplier management

## Project Structure

```text
src/app/
├── core/       # Singleton services and inventory state
├── models/     # Shared TypeScript interfaces and types
├── shared/     # Reusable UI components
├── layout/     # Application shell, sidebar, and topbar
└── features/   # Lazy-loaded dashboard and management features
```

See [docs/Plan.md](docs/Plan.md) for the complete frontend implementation plan.

## Testing Notes

Unit tests use Angular, Jasmine, Karma, and ChromeHeadless. If Chrome is installed in a non-default location, set the `CHROME_BIN` environment variable before running tests.

```powershell
$env:CHROME_BIN = "C:\Path\To\chrome.exe"
npm test -- --watch=false --browsers=ChromeHeadless
```

## Build Verification

Run the production build before committing changes:

```bash
npm run build
```

The build output is generated in `dist/inventory_stock_management/` and should not be edited manually.
