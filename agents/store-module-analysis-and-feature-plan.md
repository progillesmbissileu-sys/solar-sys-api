# Store Module Analysis and Feature Plan

## Scope

This report analyzes the current `Store` module implementation and proposes practical, non-overengineered features suitable for a small-to-mid commerce platform.

---

## 1) Current-State Analysis

### 1.1 Module and Architecture Snapshot

The module follows the project’s CQRS-style structure with:
- Controller layer: `app/controllers/store/store_controller.ts`
- Application commands:
  - `create_store_command.ts`
  - `update_store_command.ts`
- Command handlers:
  - `create_store_handler.ts`
  - `update_store_handler.ts`
- Domain:
  - `store.ts`
  - `store_repository.ts`
- Infrastructure persistence:
  - `store_ar_repository.ts`
- Active Record model:
  - `database/active-records/store.ts`
- Migration:
  - `1769279490186_create_stores_table.ts`
- Route registration:
  - `start/routes.ts`
- Dependency/CQRS provider wiring:
  - `repository_provider.ts`
  - `cqrs_provider.ts`

### 1.2 What Already Works

- `POST /api/store` is exposed and authenticated.
- `CreateStoreCommand` is dispatched from controller.
- `CreateStoreHandler` and `UpdateStoreHandler` are registered in command bus.
- `StoreRepository` is bound in DI container.
- Database schema and AR model for stores exist (`designation`, `description`, `domain_url`, timestamps).

### 1.3 Gaps and Inconsistencies

1. **Repository is not implemented**
   - `StoreARRepository.save()` and `findById()` return not-implemented errors.
   - This blocks real persistence for create/update flows.

2. **Domain model mismatch**
   - Domain entity uses `domainName`.
   - Command uses `domainUrl`.
   - AR + DB use `domainUrl` / `domain_url`.
   - Domain entity currently does not carry `description`, while command + DB do.

3. **Controller validation gap**
   - Controller uses raw `request.body()` for store creation.
   - No schema-based input validation for designation/domain/description.

4. **Partial API surface**
   - Route only exposes `store` (create).
   - Update command exists but there is no update route/action exposed.
   - No query endpoint for retrieving store data.

5. **No explicit Store query/read side**
   - No `GetStoreQuery`/`ListStoreQuery`.
   - Read behavior is not standardized like other modules.

6. **Testing gap**
   - No visible unit/integration tests for Store module behavior.

### 1.4 Practical Conclusion

The Store module is scaffolded but incomplete.  
The main blocker is persistence implementation + model consistency. Once those are fixed, it can become a reliable foundation quickly.

---

## 2) Feature Plan (Practical, Not Amazon-Scale)

Below are practical features with clear MVP scope.

---

### Feature 1 — Store Profile CRUD (Core)

**Why it matters**  
Admin needs to create and maintain store identity (name, domain, description).

**MVP scope**
- Create store
- Get store by id
- Update store basic profile

**Suggested endpoints**
- `POST /api/store`
- `GET /api/store/:id`
- `PUT /api/store/:id`

**Data/model changes**
- Align on one field name: `domainUrl` (across command/domain/repository/model).
- Add `description` to domain entity.
- Implement `StoreARRepository.save/findById`.

**Effort**: **M**

---

### Feature 2 — Store Input Validation & Constraints

**Why it matters**  
Protects data quality and prevents malformed/unsafe values.

**MVP scope**
- Add create/update validators.
- Validate:
  - `designation` min length
  - `domainUrl` format and max length
  - optional `description` max length
- Return consistent error payloads.

**Suggested endpoints**
- Applied to existing create/update endpoints.

**Data/model changes**
- Optional DB uniqueness on `domain_url`.
- Optional index on `domain_url` for lookup.

**Effort**: **S**

---

### Feature 3 — Store Status (Active/Inactive)

**Why it matters**  
Business may need temporary maintenance mode without deleting data.

**MVP scope**
- Add active/inactive status.
- Include optional `statusReason`.
- Prevent market/public exposure when inactive.

**Suggested endpoints**
- `PUT /api/store/:id/status`
- `GET /api/store/:id` (includes status)

**Data/model changes**
- Add columns:
  - `status` enum (`ACTIVE`, `INACTIVE`)
  - `status_reason` nullable

**Effort**: **S**

---

### Feature 4 — Store Settings (Basic Operational Config)

**Why it matters**  
Central place for settings used by orders/invoices/UI.

**MVP scope**
- Currency
- Timezone
- Order prefix
- Tax included flag

**Suggested endpoints**
- `GET /api/store/:id/settings`
- `PUT /api/store/:id/settings`

**Data/model changes**
- New table `store_settings`:
  - `store_id` FK unique
  - `currency`
  - `timezone`
  - `order_prefix`
  - `tax_included`

**Effort**: **M**

---

### Feature 5 — Public Store Info (Read-Only)

**Why it matters**  
Frontend/market pages need lightweight store metadata.

**MVP scope**
- Public read-only info for active store(s):
  - designation
  - domainUrl
  - description
  - status/open flag

**Suggested endpoints**
- `GET /api/market/store/:id`
  - or `GET /api/market/store/by-domain/:domain`

**Data/model changes**
- No major changes if Profile + Status exist.

**Effort**: **S**

---

### Feature 6 — Store Operating Hours (Optional but Useful)

**Why it matters**  
Useful for storefront communication and order handling expectations.

**MVP scope**
- Weekly open/close hours.
- Closed-day toggle.

**Suggested endpoints**
- `GET /api/store/:id/hours`
- `PUT /api/store/:id/hours`

**Data/model changes**
- New table `store_hours`:
  - `store_id`, `day_of_week`, `open_time`, `close_time`, `is_closed`

**Effort**: **M**

---

## 3) Prioritized Roadmap

## Phase 1 — Stabilize Core (High Priority)
1. Implement `StoreARRepository` methods.
2. Unify model naming (`domainUrl`) and add `description` in domain object.
3. Add validators for create/update store.
4. Expose `GET /api/store/:id` and `PUT /api/store/:id`.
5. Add tests for command handlers, repository, and controller validation.

**Quick wins**
- Repository implementation
- Validation schemas
- Read endpoint

---

## Phase 2 — Operational Basics
1. Add store status endpoint + status fields.
2. Add store settings (currency/timezone/order prefix/tax included).
3. Add public store read endpoint for market usage.

**Quick wins**
- Status toggle
- Read-only public endpoint

---

## Phase 3 — UX/Business Completeness
1. Add operating hours.
2. Add response DTO polish + query handlers for clean read-side separation.
3. Add admin audit fields (`createdBy`, `updatedBy`) if required.

**Quick wins**
- Hours endpoint
- Query-side standardization

---

## 4) Risks and Implementation Notes

### Key Risks
- **Naming inconsistency risk** (`domainName` vs `domainUrl`) causing mapping bugs.
- **Runtime failure risk** due to unimplemented repository methods.
- **Data quality risk** without input validation.
- **Architecture drift risk** if reads are implemented ad hoc without query handlers.

### Implementation Notes
- Keep field naming canonical: `domainUrl`.
- Implement store repository first to unlock all store commands.
- Follow same patterns used in other modules (validator + controller + command/query handler).
- Add DB constraints gradually:
  - Start with nullable-safe migrations if needed
  - Backfill data
  - Then tighten constraints.
- Add test coverage before introducing settings/hours to avoid regression.

---

## 5) Suggested MVP Backlog (Actionable)

1. Implement `StoreARRepository.save/findById`.  
2. Refactor `Store` domain entity to include:
   - `id`
   - `designation`
   - `domainUrl`
   - `description`
   - timestamps
3. Create `create_store_validator` and `update_store_validator`.
4. Extend controller with:
   - `show`
   - `update`
5. Extend routes:
   - include `show`, `update` for `store`.
6. Add query handler for `GetStoreQuery` (recommended).
7. Add tests:
   - unit: handlers
   - integration: repository persistence
   - HTTP: validation + status codes

---

## Final Recommendation

Start with **Phase 1** immediately.  
It is small enough to deliver quickly and unlocks real Store module usability.  
Then add **Status + Settings** for practical operational control.  
This keeps complexity low while delivering clear business value.