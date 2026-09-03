# Inventory Stock Management

Frontend-only inventory and stock management application built with Angular 17, TypeScript, RxJS, and Tailwind CSS.

The application is organized into lazy-loaded feature modules for the dashboard, products, categories, and suppliers. Product workflows include reactive-form validation, stock adjustment, search, filters, pagination, and stock-status alerts.

## Current Data Source

The frontend talks to a real HTTP API (Django-style backend) at `http://127.0.0.1:8000`. The API host is configurable in `src/environments/environment.development.ts` and the backend must be running for data to load. All requests are made through the services in `core/services/`, which act as the single integration boundary with the backend. If the API is unreachable, the dashboard shows a clear "unable to reach the inventory API" message instead of failing silently.

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
├── core/       # Singleton services: API base URL, auth, product/category/supplier/dashboard
├── auth/       # Login/signup pages and the route guard
├── layout/     # Application shell: layout wrapper, sidebar, and topbar global search
└── features/   # Lazy-loaded feature modules: dashboard, products, categories, suppliers
```

See [docs/Plan.md](docs/Plan.md) for the complete frontend implementation plan.

## API Requirements

The app expects the following REST endpoints (relative to the base URL in `environment.development.ts`):

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/v1/products/` | GET, POST, DELETE | List and manage products |
| `/api/v1/products/summary/` | GET | Dashboard summary counts and stock value |
| `/api/v1/categories/` | GET, POST, PUT, DELETE | List and manage categories |
| `/api/v1/suppliers/` | GET, POST, PUT, DELETE | List and manage suppliers |

Data contracts: the products list response is wrapped in an `{ "items": [...] }` object, and `unit_price` is sent as a string (coerced to a number in `product.service.ts`). The dashboard `total_stock_value` is returned as pre-formatted currency.

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
