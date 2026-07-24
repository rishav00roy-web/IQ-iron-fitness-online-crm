# IQ Iron Fitness Online CRM

## Overview
This is the modernized, online version of the IQ Iron Gym CRM. Unlike the original offline HTML/JS version, this project is built with **Next.js 16 (App Router)** and **React**, allowing it to be hosted online and accessed from anywhere.

## Tech Stack
- **Framework:** Next.js 16 (Turbopack)
- **Styling:** Custom Vanilla CSS (`globals.css`) designed for a premium, dynamic feel.
- **Database:** Supabase (PostgreSQL) with Realtime Sync enabled.
- **Hosting Target:** Online / Cloud (Vercel or local Node.js server).

## Core Modules
- [[Member-Management]]: Add, edit, and delete members. Tracks active/expired plans and pending balances.
- [[WhatsApp-Integration]]: Broadcast automated reminders and send PDF fee receipts via WhatsApp.

## Mobile Optimization
The CRM is fully responsive and specifically optimized for modern smartphones like the iPhone 15 Pro Max and OnePlus 12R. Viewport scaling is locked to prevent zooming issues on inputs.
