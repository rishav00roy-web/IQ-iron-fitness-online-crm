# Project History & Bug Fixes (July 24, 2026)

## Migration to Online
- **Framework Upgrade**: Successfully migrated the original standalone HTML offline CRM to a fully functional Next.js 16 App Router project.
- **Database**: Replaced local storage with a live Supabase PostgreSQL database.
- **Realtime Sync**: Implemented Supabase Realtime so that adding/editing a member instantly updates the UI for all connected clients.

## Bug Fixes & UX Polish
- **Button Handlers**: Fixed missing `onClick` events for the `Save Member`, `Update Member`, `Cancel`, `Broadcast All`, and `Delete Permanently` buttons.
- **Form Submissions**: Configured forms to use `type="submit"` to allow seamless "Enter" key submissions without page reloads.
- **Derived State Fixes**: Resolved React console warnings by changing `value` props to `defaultValue` and adding `readOnly` where appropriate (e.g., Total Fee and Balance inputs).
- **Balance UI Logic**: Wired up the clickable balance pill in the table to open the "Edit Member / Payments" dialog directly.
- **Footer Updates**: Changed the footer status to "Live Sync • Supabase" to reflect the new architecture.

## Responsive & Mobile Design
- **Device Support**: Ensured the grid layout and table panels scale perfectly on iPhone 15 Pro Max and OnePlus 12R.
- **Viewport Lock**: Added Next.js viewport config `maximum-scale=1` to prevent iOS from automatically zooming in when input fields are tapped.

## New Features Built
- **PDF Bill Maker**: Added a new receipt generator that uses `html2pdf.js` to create beautiful, branded gym invoices.
- **WhatsApp PDF Delivery**: Configured the bill maker to instantly generate a `wa.me` WhatsApp deep link with a prefilled message after the PDF downloads, allowing the admin to easily attach and send the invoice.
