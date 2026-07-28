# Member Management

This is the core CRUD module for managing gym members, trainers, and payroll.

## Database Schema (Supabase)

### 1. `members` Table
Stores gym members with the following key fields:
- `id` (UUID)
- `name`, `phone`, `dob`
- `membership_type` (e.g., Monthly, Quarterly, Yearly)
- `start_date`, `expiry_date`
- `has_personal_trainer` (Boolean)
- `trainer_id` (UUID, references `trainers.id`)
- `pt_fee` (Decimal - Monthly fee for PT)
- `total_fee` (Decimal - Total Gym Fee)
- `pending_amount` (Decimal - Balance Due)
- `renewal_streak` (Integer)

### 2. `trainers` Table
Stores personal trainers:
- `id` (UUID)
- `name` (String)

### 3. `payroll` Table
Tracks monthly payroll and commission for trainers:
- `id` (UUID)
- `trainer_id` (UUID, references `trainers.id`)
- `period` (String, e.g. "2026-07")
- `basic_pay` (Decimal)
- `commission` (Decimal - Sum of assigned members' `pt_fee`)
- `total_salary` (Decimal)

## Interface
The **TablePanel** displays a responsive grid/table of all members with search and sorting functionality.
- **Search:** Instant client-side filtering by name, phone, or plan.
- **Sort:** Column headers (Name, Status, Expiry, Balance) can be clicked to sort ascending or descending.
- **Visual Status:** Members are automatically tagged as `Active` (Green) or `Expired` (Red) based on the current date relative to their `expiry_date`.
- **Balances:** The pending balance is displayed as a clickable red pill. Clicking it opens the Edit Modal to quickly log a payment.
- **Manage Trainers:** Add or remove trainers globally; changes reflect in member dropdowns.
