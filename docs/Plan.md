# Inventory & Stock Management Frontend Plan

## 1. Project Goal

Build a responsive inventory management frontend using Angular 17, TypeScript, RxJS, reactive forms, and Tailwind CSS.

The frontend will provide:

- Dashboard inventory summaries
- Product CRUD screens
- Category CRUD screens
- Supplier CRUD screens
- Stock adjustment workflow
- Search, filters, pagination, and stock-status alerts
- Loading, empty, validation, success, and error states

For this frontend-only implementation, typed services will use local mock data and RxJS. The service interfaces should remain API-ready so a future data source can replace the mock repository without requiring feature components to change.

## 2. Frontend Architecture

### Core Module

Own application-wide singleton services and configuration:

- Product, category, and supplier services
- Mock data repository and in-memory state
- API configuration placeholder
- Global notification service
- Application-wide error handling

### Shared Module

Own reusable presentation pieces and common imports:

- Loading spinner
- Empty state
- Confirmation dialog
- Toast notifications
- Pagination control
- Stock-status badge
- Form field error display
- Reusable buttons, modal layout, and table utilities

Shared components must remain feature-agnostic. Product, category, and supplier business rules belong in their feature modules or services.

### Models Module

Define shared TypeScript contracts:

- `Category`
- `Supplier`
- `Product`
- `StockStatus`
- `StockAdjustment`
- `ProductFilters`
- `PaginatedResult<T>`
- `DashboardSummary`
- `OperationResult`

### Feature Modules

Use lazy-loaded Angular feature modules:

- `DashboardModule`
- `ProductsModule`
- `CategoriesModule`
- `SuppliersModule`

Each feature should own its routes, page components, feature-specific state, and feature-specific tests. Keep the current module-based structure and extend the existing folders in place.

## 3. Target Folder Structure

```text
src/app/
├── core/
│   ├── core.module.ts
│   ├── services/
│   │   ├── category.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── notification.service.ts
│   │   ├── product.service.ts
│   │   └── supplier.service.ts
│   └── state/
│       └── inventory.store.ts
├── models/
│   ├── category.model.ts
│   ├── dashboard.model.ts
│   ├── product.model.ts
│   └── supplier.model.ts
├── shared/
│   ├── shared.module.ts
│   └── components/
│       ├── confirm-dialog/
│       ├── empty-state/
│       ├── form-field-error/
│       ├── loading-spinner/
│       ├── pagination/
│       ├── status-badge/
│       └── toast/
├── features/
│   ├── dashboard/
│   │   ├── dashboard.module.ts
│   │   └── dashboard.component.*
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products-routing.module.ts
│   │   ├── product-list/
│   │   ├── product-form/
│   │   └── stock-adjust-modal/
│   ├── categories/
│   │   └── categories.module.ts
│   └── suppliers/
│       └── suppliers.module.ts
├── app.config.ts
├── app.routes.ts
└── app.component.*
```

## 4. UI and Tailwind Guidelines

- Configure Tailwind content paths for all Angular HTML and TypeScript templates.
- Define a small design system using Tailwind classes for colors, spacing, typography, borders, focus rings, and status states.
- Use a responsive application shell with navigation, page title, content area, and notification outlet.
- Use compact data tables on desktop and horizontal scrolling or stacked rows on smaller screens.
- Use consistent visual states: green for in-stock, amber for low-stock, and red for out-of-stock.
- Use accessible labels, keyboard-friendly dialogs, visible focus states, and sufficient color contrast.
- Keep buttons and controls stable in size so loading text and validation messages do not shift the layout.
- Avoid duplicating long class lists by extracting genuinely repeated UI patterns into shared components.

## 5. Frontend Routes

```text
/dashboard
/products
/products/new
/products/:id/edit
/categories
/suppliers
```

Configure the routes with lazy-loaded feature modules and a default redirect to `/dashboard`. Add a not-found route for unknown URLs.

## 6. Delivery Phases

### Phase 1: Foundation and application shell

1. Confirm Angular 17, TypeScript, Tailwind, and existing build/test commands.
2. Verify Tailwind utility classes render from Angular templates.
3. Configure the root application layout and responsive navigation.
4. Add lazy-loaded routes for dashboard, products, categories, and suppliers.
5. Create shared models and base service/store interfaces.
6. Add shared loading, empty, toast, modal, and status-badge components.

**Exit check:** `npm run build` succeeds and every route displays a valid placeholder page.

### Phase 2: Inventory state and services

1. Create typed local mock data for categories, suppliers, and products.
2. Implement an in-memory inventory store using `BehaviorSubject` or a similar RxJS pattern.
3. Implement category and supplier services for list, create, update, and delete operations.
4. Implement product service methods for list, detail, create, update, soft delete, and stock adjustment.
5. Compute stock status from quantity and reorder level in one shared domain helper.
6. Implement dashboard summary calculations from active products.
7. Add simulated loading and error states so UI behavior can be tested realistically.

**Exit check:** services expose typed observable results and mutations update all dependent views consistently.

### Phase 3: Product list and navigation

1. Build the product table with name, SKU, category, supplier, price, quantity, reorder level, and status.
2. Add search by product name or SKU.
3. Add category and stock-status filters.
4. Add client-side pagination over the service result, with page-size selection if needed.
5. Show loading, empty, filtered-empty, and error states.
6. Add Edit, Adjust Stock, and Delete actions.
7. Add confirmation before soft deleting a product.
8. Preserve filters and page state when returning from the edit screen where practical.

**Exit check:** users can find, filter, page through, edit, adjust, and delete products from the list.

### Phase 4: Product forms and stock adjustment

1. Build the reactive add/edit product form.
2. Add validation for required fields, maximum lengths, positive unit price, non-negative quantity, and valid reorder level.
3. Populate category and supplier dropdowns from their services.
4. Display field-level validation messages and a form-level error state.
5. Build the stock adjustment modal with increase/decrease quantity and required reason.
6. Prevent an adjustment that would make stock negative.
7. Show the resulting quantity and status after a successful adjustment.
8. Show success and error notifications for all mutations.

**Exit check:** invalid form submissions are blocked, valid submissions update the product list, and stock can never become negative through the UI.

### Phase 5: Category and supplier management

1. Build category list and inline or modal add/edit form.
2. Validate required category name, maximum length, and duplicate names in the mock store.
3. Add category delete confirmation and empty/loading/error states.
4. Build supplier list and add/edit form.
5. Validate required name, email format, phone length, and optional address length.
6. Add supplier delete confirmation and mutation notifications.
7. Handle products that reference a category or supplier with a clear user-facing message.

**Exit check:** categories and suppliers support complete frontend CRUD workflows with validation and confirmation states.

### Phase 6: Dashboard and responsive polish

1. Build summary cards for total active products, total stock value, low-stock count, and out-of-stock count.
2. Add links from alert counts to the relevant product filter.
3. Add a low-stock/out-of-stock product section for quick review.
4. Standardize Tailwind styles across navigation, cards, tables, forms, modals, badges, and notifications.
5. Verify tablet layouts, table overflow, long text, validation messages, and empty states.
6. Verify keyboard navigation, focus handling, dialog dismissal, and accessible labels.

**Exit check:** the application is visually consistent, responsive, and usable across the main inventory workflows.

### Phase 7: Testing and handoff

1. Add service tests for CRUD, duplicate detection, soft delete, stock adjustment, and summary calculations.
2. Add component tests for forms, validation, filters, pagination, status badges, dialogs, loading, and empty states.
3. Add route and navigation tests for lazy-loaded features.
4. Run the Angular production build and unit test suite.
5. Update `README.md` with frontend prerequisites, install, start, build, and test commands.
6. Document the mock data approach and the service boundary for future API integration.
7. Add screenshots or a short walkthrough covering all required UI workflows.

**Exit check:** a new developer can install dependencies, run the frontend, execute tests, and verify every acceptance criterion locally.

## 7. Acceptance Checklist

- [ ] Angular 17 modular feature structure is implemented.
- [ ] Dashboard, products, categories, and suppliers have lazy-loaded routes.
- [ ] Tailwind CSS is configured and used consistently for responsive styling.
- [ ] Product list supports search, category filter, stock-status filter, and pagination.
- [ ] Product add/edit form uses reactive forms and displays validation errors.
- [ ] Category and supplier dropdowns work in the product form.
- [ ] Stock adjustment supports increase, decrease, and reason entry.
- [ ] Negative stock adjustments are blocked.
- [ ] Stock status is computed as in stock, low stock, or out of stock.
- [ ] Low-stock and out-of-stock products are visually flagged.
- [ ] Dashboard totals and stock value update after mutations.
- [ ] Category and supplier CRUD workflows work with confirmation before deletion.
- [ ] Product deletion is represented as a soft delete in frontend state.
- [ ] Loading, empty, error, success, and confirmation states are implemented.
- [ ] Keyboard access, focus states, labels, and responsive layouts are verified.
- [ ] Angular unit tests and production build pass.
- [ ] README documents local frontend setup and the future service integration boundary.

## 8. Suggested Working Order

Build one complete frontend slice at a time: model, service/store operation, screen state, Tailwind UI, and tests. Start with the application shell and mock inventory state, then complete the product list, product form, stock adjustment, lookup management, and dashboard. Keep each phase independently runnable and reviewable.
