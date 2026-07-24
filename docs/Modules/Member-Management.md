# Member Management

This is the core CRUD module for managing gym members.

## Database Schema (Supabase)
Members are stored in a PostgreSQL table with the following key fields:
- `id` (UUID)
- `name`, `phone`, `email`
- `plan` (e.g., 1 Month, 3 Months, 1 Year)
- `join_date`, `end_date`
- `plan_amount` (Total Fee)
- `pending_amount` (Balance Due)
- `status` (Active / Expired)

## Interface
The **TablePanel** displays a responsive grid/table of all members with search functionality.
- **Search:** Instant client-side filtering by name, phone, or plan.
- **Visual Status:** Members are automatically tagged as `Active` (Green) or `Expired` (Red) based on the current date relative to their `end_date`.
- **Balances:** The pending balance is displayed as a clickable red pill. Clicking it opens the Edit Modal to quickly log a payment.
- **Realtime Sync:** Uses Supabase `on('postgres_changes')` to instantly update the UI when any member is added, updated, or deleted by another user.
