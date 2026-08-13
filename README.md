# Elisa Decor Plywood — MERN Stack Application

A premium, SEO-optimized brand website and CMS for **Elisa Decor** to showcase their high-quality decor plywood product lines: **Elisa Green**, **Elisa Club 710**, and **Elisa Premium**. Built with a modern MERN stack architecture.

---

## 📁 Architecture Overview

- **`client/`**: React 18 frontend built with Vite, React Router v6, Tailwind CSS v4, Framer Motion, and Lucide icons.
- **`server/`**: Express API server built with Node.js, Mongoose, MongoDB, rate limiters, Nodemailer SMTP client, and Cloudinary v2 image streaming.
- **`mongodb_data/`**: Local MongoDB instance database files.

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **MongoDB** local service or instance running on port `27017`

### Step 1 — Seed the Database
Seed default super-admin, site settings, homepage sections layout, and initial products:
```bash
cd server
node scripts/seed.js
```
**Admin Credentials:**
- **Email:** `admin@elisadecor.com`
- **Password:** `admin123`

### Step 2 — Run servers
Start the backend Express server (listens on port `5000`):
```bash
cd server
npm run dev
```

Start the frontend Vite + React client (listens on port `5173`):
```bash
cd client
npm run dev
```

Open your browser to:
- Public website: **`http://localhost:5173`**
- Administrative CMS: **`http://localhost:5173/admin`**

---

## 🛠️ CMS Features
- **Lead/Enquiries Management**: Log, view, edit notes, mark as spam, and export enquiries to CSV.
- **Product Management**: Complete CRUD for dynamic product catalog sheets.
- **Media Library**: Stream-upload images directly to Cloudinary and optimize them.
- **Homepage Builder**: Arrange sections, toggle visibility, and edit text blocks dynamically.
- **Brand Settings**: Set brand details, contact coordinates, social URLs, maps, and SEO keywords.
