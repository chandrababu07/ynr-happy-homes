# YNR Happy Homes - Production-Quality Web Platform Implementation Plan

Building a premium, modern, production-grade web application for **YNR Happy Homes** (Established 2025, Mangalagiri, Andhra Pradesh). The platform serves three main business divisions: **INFRA** (Construction Equipment Rental), **REAL ESTATE** (Property Brokerage), and **CONSTRUCTION** (Own Projects & Flat Matrix), alongside an interactive **Admin Portal** for managing listings, projects, and enquiries.

## User Review Required

> [!IMPORTANT]
> - **Location & Contact**: Displayed prominently across the app as *IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, AP – 522510* and Phone: `7385293949`.
> - **Strict Dynamic Data Engine**: Real Estate, Infra Equipment, Construction Projects, and Unit Availability are powered by a unified reactive local storage store, enabling full CRUD (Add/Edit/Mark Sold/Archive) from a built-in Admin Portal without hardcoding properties.
> - **Enquiry Flow**: Equipment rentals & property enquiries route cleanly to an interactive modal, quick WhatsApp connect, and persistent Admin Enquiry Inbox.

## Open Questions

> [!NOTE]
> All primary requirements are clear. If you have specific brand logo files or high-res drone shots of your Hyundai Smart Plus 210 or Mangalagiri project sites later, they can be uploaded directly via the Admin Portal.

---

## Proposed Changes

### Project Initialization & Architecture

#### [NEW] [`package.json`](file:///d:/ynr-happy-homes/package.json)
- React 18 / Vite / TypeScript setup.
- Dependencies: `lucide-react`, `tailwindcss`, `@tailwindcss/vite` (or `autoprefixer`), `clsx`, `tailwind-merge`.

#### [NEW] [`index.html`](file:///d:/ynr-happy-homes/index.html)
- SEO tags, Meta descriptions, Google Fonts (Plus Jakarta Sans & Outfit for luxury architectural feel), page title: "YNR Happy Homes | Infra, Real Estate & Construction - Mangalagiri, AP".

---

### Data Models & Reactive Storage Store

#### [NEW] [`src/types/index.ts`](file:///d:/ynr-happy-homes/src/types/index.ts)
- TypeScript interfaces for `Equipment` (Infra), `Property` (Real Estate), `ConstructionProject` & `ProjectUnit` (Construction), `Enquiry`, and `FilterState`.

#### [NEW] [`src/services/storage.ts`](file:///d:/ynr-happy-homes/src/services/storage.ts)
- Reactive local storage service with seed data representing realistic Mangalagiri / Amaravati / Guntur properties, Hyundai Smart Plus 210 excavator, JCBs, tippers, and residential/commercial projects.

---

### UI Components & Features

#### [NEW] [`src/components/Navbar.tsx`](file:///d:/ynr-happy-homes/src/components/Navbar.tsx)
- Glassmorphism sticky navbar with YNR Happy Homes branding, division badges (Infra, Real Estate, Construction), direct phone call button `7385293949`, WhatsApp quick connect, and Admin Portal trigger.

#### [NEW] [`src/components/Hero.tsx`](file:///d:/ynr-happy-homes/src/components/Hero.tsx)
- High-impact architectural hero with division switcher, quick property search filter, equipment rental request CTA, and trust badges (Established 2025 | Mangalagiri, AP).

#### [NEW] [`src/components/InfraSection.tsx`](file:///d:/ynr-happy-homes/src/components/InfraSection.tsx)
- Equipment rental catalog featuring Hyundai Smart Plus 210 excavator, JCB 3DX, Tata Tipper Trucks, Mobile Cranes.
- Machine specs, rental basis (hourly/daily/monthly), operator-included badge, availability status, service area map overlay.
- Dynamic Rental Enquiry Modal with customer work location, duration, date picker, and direct submission.

#### [NEW] [`src/components/RealEstateSection.tsx`](file:///d:/ynr-happy-homes/src/components/RealEstateSection.tsx)
- Dynamic property listing engine for Land, Sites/Plots, Apartments, Houses, Commercial Land & Properties.
- Interactive filter bar: Search, Category, Price Range, Location (Mangalagiri, Nambur, Amaravati, Guntur, Vijayawada), Status (Available / Sold).
- Property cards with photo carousel, key specs, "SOLD" ribbon, and Property Detail Modal with full gallery, map location placeholder, and enquiry CTA.

#### [NEW] [`src/components/ConstructionSection.tsx`](file:///d:/ynr-happy-homes/src/components/ConstructionSection.tsx)
- Construction project portfolio (Apartments, Individual Houses, Commercial Buildings).
- Progress tracker (Foundation, Structure, Brickwork, Finishing, Handover), stats bar (Total, Available, Booked, Sold units).
- Interactive Unit/Flat Availability Matrix & selector with floor plan preview modal and enquiry form.

#### [NEW] [`src/components/AdminPortal.tsx`](file:///d:/ynr-happy-homes/src/components/AdminPortal.tsx)
- Production-ready Admin Dashboard to:
  - Add / Edit / Mark SOLD / Archive Real Estate properties.
  - Add / Edit Equipment catalog & toggle availability.
  - Manage Construction Projects, update progress %, and update Unit Matrix statuses (Available, Booked, Sold).
  - View & manage customer enquiries in real-time.

#### [NEW] [`src/components/Footer.tsx`](file:///d:/ynr-happy-homes/src/components/Footer.tsx)
- Comprehensive footer with company address (IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, AP – 522510), phone (7385293949), quick links, division breakdown, and copyright 2025 YNR Happy Homes.

#### [NEW] [`src/components/EnquiryModal.tsx`](file:///d:/ynr-happy-homes/src/components/EnquiryModal.tsx)
- Unified interactive modal for Equipment Rental, Property Enquiry, and Unit Booking with direct submission to local store & WhatsApp link generation.

---

## Verification Plan

### Automated Tests
- TypeScript type checking: `npx tsc --noEmit`
- Production Build validation: `npm run build`

### Manual Verification
- Test equipment rental enquiry flow with custom duration, work location, and operator request.
- Test property filters (Price, Category, Location) and dynamic details modal.
- Test admin portal: Add a new property, mark an existing property as SOLD, update unit availability on a construction project, and verify instant updates on the main website.
- Verify responsive layout on mobile, tablet, and desktop viewports.
