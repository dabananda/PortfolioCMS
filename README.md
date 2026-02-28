<div align="center">

# PortfolioCMS

**A modern, full-stack Portfolio Management System**
built with ASP.NET Core 10, Next.js 16, and Clean Architecture.

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/download/dotnet/10.0)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![EF Core](https://img.shields.io/badge/EF%20Core-10.0-512BD4?style=flat-square)](https://learn.microsoft.com/en-us/ef/core/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](./CONTRIBUTING.md)

[Getting Started](#getting-started) · [Features](#features) · [Architecture](#architecture) · [Screenshots](#screenshots) · [Contributing](#contributing) · [License](#license)

</div>

---

## Overview

PortfolioCMS is an open-source, full-stack content management system designed to let developers and creatives **build, manage, and showcase their portfolio** through a beautiful admin dashboard and a public-facing portfolio website.

The **backend** is built on **ASP.NET Core 10** with a strict **Clean Architecture** separation of concerns, providing a secure REST API. The **frontend** is a **Next.js 16** application with React 19, Tailwind CSS 4, and a premium dark-themed admin dashboard — giving you a complete, production-ready portfolio platform out of the box.

---

## Features

### 🖥️ Frontend (Next.js 16)

- **Admin Dashboard** — Premium dark-themed UI with real-time stats, animated charts, and glassmorphism design
- **Blog Management** — Full markdown editor with toolbar, live preview, inline image uploads, and keyboard shortcuts (Ctrl+S, Ctrl+B, Ctrl+I)
- **Blog Search & Filtering** — Search posts by title/summary, filter by category, and filter by publish status
- **Blog Categories** — Create, edit, and delete categories with a tabbed interface (Posts | Categories)
- **Profile Editor** — Two-column layout with a live profile preview card showing avatar, name, headline, status, visibility, and a profile completeness tracker
- **Portfolio Sections** — Manage skills, education, work experience, projects, certifications, social links, reviews, and extra-curricular activities
- **Contact Messages** — Inbox to view, read, and manage messages from visitors
- **Authentication** — Login, register, email confirmation, forgot/reset password flows
- **Public Portfolio** — Public-facing portfolio page and blog with responsive layout, navigation, and footer
- **Cloud Image Uploads** — Profile photos, resume PDFs, and blog cover images uploaded via Cloudinary
- **Resume Preview** — Embedded PDF viewer using Google Docs Viewer for reliable rendering
- **Settings** — Change password, SMTP email configuration

### ⚙️ Backend (ASP.NET Core 10)

- 🔐 **JWT Authentication** with secure refresh token rotation
- 🔒 **AES Encryption** for sensitive data fields
- 👤 **Role-based authorization** with a seeded admin user
- 🔑 **Account Management** — change password, update name, and delete account
- 📁 **Portfolio & Project management** via a structured REST API
- 🖼️ **Cloud file uploads** — profile images and resumes uploaded directly to **Cloudinary CDN**
- 🔏 **Portfolio privacy toggle** — portfolios are private by default; owners explicitly publish when ready
- 📨 **Contact message email notifications** — portfolio owners are notified by email when someone submits a contact form
- 🧱 **Clean Architecture** — Domain, Application, Infrastructure, and API layers strictly separated
- 🗃️ **Entity Framework Core** with SQL Server and full migration support
- 📋 **Structured logging** via Serilog
- ⚠️ **Global exception handling** middleware for consistent API error responses

---

## Tech Stack

| Layer                  | Technology                                         |
| ---------------------- | -------------------------------------------------- |
| **Frontend**           | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 |
| **State Management**   | TanStack React Query, Zustand                      |
| **UI Components**      | Radix UI, Lucide React Icons, Shadcn               |
| **Forms & Validation** | React Hook Form, Zod                               |
| **Backend**            | ASP.NET Core 10, C#                                |
| **ORM**                | Entity Framework Core 10                           |
| **Database**           | SQL Server                                         |
| **Authentication**     | JWT + Refresh Tokens                               |
| **File Storage**       | Cloudinary CDN                                     |
| **Logging**            | Serilog                                            |

---

## Architecture

### Backend — Clean Architecture

Dependencies flow strictly inward — outer layers depend on inner layers, never the reverse.

```
PortfolioCMS.Server/
├── PortfolioCMS.Server.Api/            # HTTP layer: Controllers, Middleware, DI setup
├── PortfolioCMS.Server.Application/    # Use cases: DTOs, Interfaces, Mappings
├── PortfolioCMS.Server.Domain/         # Core: Entities, Domain Exceptions, Shared Models
└── PortfolioCMS.Server.Infrastructure/ # External: DbContext, Migrations, Auth, Email, Cloudinary
```

```
[ Api ] → [ Application ] → [ Domain ]
                ↑
       [ Infrastructure ]
```

> `Domain` has zero external dependencies. `Application` depends only on `Domain`. `Infrastructure` implements `Application` interfaces. `Api` wires everything together.

### Frontend — Next.js App Router

```
portfoliocms.client/
├── app/
│   ├── (admin)/dashboard/       # Admin dashboard (protected)
│   │   ├── page.tsx             # Dashboard home with stats & charts
│   │   ├── blog/                # Blog posts & categories management
│   │   │   ├── new/             # New blog post editor (markdown)
│   │   │   └── [id]/edit/       # Edit existing blog post
│   │   ├── profile/             # Profile editor with live preview
│   │   ├── skills/              # Skills management
│   │   ├── education/           # Education management
│   │   ├── work-experience/     # Work experience management
│   │   ├── projects/            # Projects management
│   │   ├── messages/            # Contact messages inbox
│   │   └── settings/            # Password & SMTP settings
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/               # Login
│   │   ├── register/            # Registration
│   │   ├── forgot-password/     # Forgot password
│   │   ├── reset-password/      # Reset password
│   │   └── confirm-email/       # Email confirmation
│   └── (public)/                # Public-facing portfolio
│       └── page.tsx             # Public portfolio page
├── components/                  # Shared UI components
└── lib/                         # API utilities, auth helpers
```

---

## Getting Started

### Prerequisites

| Tool                                                             | Version                                  |
| ---------------------------------------------------------------- | ---------------------------------------- |
| [.NET SDK](https://dotnet.microsoft.com/download/dotnet/10.0)    | 10.0 or later                            |
| [Node.js](https://nodejs.org/)                                   | 18.0 or later                            |
| SQL Server                                                       | LocalDB or Docker                        |
| EF Core CLI                                                      | `dotnet tool install --global dotnet-ef` |
| [Cloudinary Account](https://cloudinary.com/users/register/free) | Free tier is sufficient                  |

---

### 1. Clone the Repository

```bash
git clone https://github.com/dabananda/portfoliocms.git
cd portfoliocms
```

### 2. Configure Backend Secrets

Navigate to the `PortfolioCMS.Server.Api` directory and set up the required secrets:

```bash
cd PortfolioCMS.Server/PortfolioCMS.Server.Api

dotnet user-secrets init

dotnet user-secrets set "JwtSettings:Secret" "YourSuperSecretKeyThatIsAtLeast32CharactersLong!"
dotnet user-secrets set "EncryptionSettings:Key" "12345678901234567890123456789012"
dotnet user-secrets set "AdminUser:Email" "admin@example.com"
dotnet user-secrets set "AdminUser:Password" "Admin@123!"

# Cloudinary (required for image and resume uploads)
dotnet user-secrets set "Cloudinary:CloudName" "your_cloud_name"
dotnet user-secrets set "Cloudinary:ApiKey"    "your_api_key"
dotnet user-secrets set "Cloudinary:ApiSecret" "your_api_secret"
```

> ⚠️ `EncryptionSettings:Key` must be **exactly 32 characters**. Your Cloudinary credentials can be found in the [Cloudinary Console](https://console.cloudinary.com/). Never commit secrets to source control.

### 3. Apply Database Migrations

```bash
dotnet ef database update --project PortfolioCMS.Server.Infrastructure --startup-project PortfolioCMS.Server.Api
```

### 4. Start the Backend

```bash
dotnet run --project PortfolioCMS.Server.Api
```

The API will be available at `https://localhost:{port}`.
Swagger UI is accessible at `https://localhost:{port}/swagger` in development mode.

### 5. Set Up the Frontend

In a new terminal, navigate to the frontend directory:

```bash
cd portfoliocms.client
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://localhost:{port}/api/v1
```

> Replace `{port}` with your backend's actual port number.

### 6. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## API Overview

### Authentication & Account

| Method   | Endpoint                          | Auth | Description                             |
| -------- | --------------------------------- | ---- | --------------------------------------- |
| `POST`   | `/api/v1/auth/register`           | ❌   | Register a new user                     |
| `POST`   | `/api/v1/auth/login`              | ❌   | Login and receive tokens                |
| `POST`   | `/api/v1/auth/refresh`            | ❌   | Refresh access token                    |
| `POST`   | `/api/v1/auth/forgot-password`    | ❌   | Request password reset email            |
| `POST`   | `/api/v1/auth/reset-password`     | ❌   | Reset password using email token        |
| `GET`    | `/api/v1/auth/confirm-email`      | ❌   | Confirm email address                   |
| `GET`    | `/api/v1/auth/check-username`     | ❌   | Check username availability             |
| `POST`   | `/api/v1/account/change-password` | ✅   | Change authenticated user's password    |
| `PUT`    | `/api/v1/account/update-name`     | ✅   | Update first and last name              |
| `DELETE` | `/api/v1/account`                 | ✅   | Permanently delete account and all data |

### File Uploads

| Method | Endpoint                | Auth | Description                                   |
| ------ | ----------------------- | ---- | --------------------------------------------- |
| `POST` | `/api/v1/upload/image`  | ✅   | Upload profile image to Cloudinary (max 5 MB) |
| `POST` | `/api/v1/upload/resume` | ✅   | Upload resume to Cloudinary (max 10 MB)       |

### Portfolio Content (all require auth)

| Method                      | Endpoint                          | Description                                              |
| --------------------------- | --------------------------------- | -------------------------------------------------------- |
| `GET/POST/PUT`              | `/api/v1/userprofile`             | Manage your profile — includes `isPublic` privacy toggle |
| `GET/POST/PUT/DELETE`       | `/api/v1/skill`                   | Skills                                                   |
| `GET/POST/PUT/DELETE`       | `/api/v1/education`               | Education history                                        |
| `GET/POST/PUT/DELETE`       | `/api/v1/workexperience`          | Work experience                                          |
| `GET/POST/PUT/DELETE`       | `/api/v1/project`                 | Projects                                                 |
| `GET/POST/PUT/DELETE`       | `/api/v1/certification`           | Certifications                                           |
| `GET/POST/PUT/DELETE`       | `/api/v1/sociallink`              | Social links                                             |
| `GET/POST/PUT/DELETE`       | `/api/v1/review`                  | Reviews / testimonials                                   |
| `GET/POST/PUT/DELETE`       | `/api/v1/extracurricularactivity` | Extra-curricular activities                              |
| `GET/POST/PUT/DELETE`       | `/api/v1/problemsolving`          | Competitive programming stats                            |
| `GET/POST/PUT/DELETE`       | `/api/v1/blogpostcategory`        | Blog categories                                          |
| `GET/POST/PUT/DELETE/PATCH` | `/api/v1/blogpost`                | Blog posts (with publish/unpublish)                      |
| `GET/PATCH/DELETE`          | `/api/v1/contactmessage`          | Inbox — messages sent by visitors                        |

### Admin Settings (require auth)

| Method    | Endpoint                       | Description              |
| --------- | ------------------------------ | ------------------------ |
| `GET/PUT` | `/api/v1/adminsettings/system` | SMTP email configuration |

### Public Portfolio (anonymous, no auth)

| Method | Endpoint                                       | Description                                                     |
| ------ | ---------------------------------------------- | --------------------------------------------------------------- |
| `GET`  | `/api/v1/portfolio`                            | Full public portfolio (default user, only if `isPublic = true`) |
| `GET`  | `/api/v1/portfolio/{username}`                 | Full public portfolio by username                               |
| `GET`  | `/api/v1/portfolio/{username}/blog`            | Published blog posts                                            |
| `GET`  | `/api/v1/portfolio/{username}/blog/{slug}`     | Single published blog post                                      |
| `POST` | `/api/v1/portfolio/{username}/contact-message` | Send a contact message (triggers owner email)                   |

---

## Admin Dashboard Pages

| Page                | Route                        | Description                                                                      |
| ------------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| **Dashboard**       | `/dashboard`                 | Overview with stats cards, blog/message counts, and quick actions                |
| **Blog**            | `/dashboard/blog`            | Posts table with search, category filter, status filter. Categories tab for CRUD |
| **New Post**        | `/dashboard/blog/new`        | Markdown editor with toolbar, live preview, cover images, and keyboard shortcuts |
| **Edit Post**       | `/dashboard/blog/[id]/edit`  | Edit existing posts with all the same editor features                            |
| **Profile**         | `/dashboard/profile`         | Two-column editor with live preview card and profile completeness tracker        |
| **Skills**          | `/dashboard/skills`          | Manage skills with name and proficiency                                          |
| **Education**       | `/dashboard/education`       | Manage education history                                                         |
| **Work Experience** | `/dashboard/work-experience` | Manage work experience entries                                                   |
| **Projects**        | `/dashboard/projects`        | Manage portfolio projects                                                        |
| **Messages**        | `/dashboard/messages`        | Contact messages inbox with read/unread status                                   |
| **Settings**        | `/dashboard/settings`        | Change password and configure SMTP email settings                                |

---

## Contributing

Contributions are welcome and appreciated! Please read the [Contributing Guide](./CONTRIBUTING.md) to get started, and review our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.

To report a bug, use the [Bug Report template](https://github.com/dabananda/portfoliocms/issues/new?template=bug_report.md).
To suggest a feature, use the [Feature Request template](https://github.com/dabananda/portfoliocms/issues/new?template=feature_request.md).

---

## Security

If you discover a security vulnerability, please **do not** open a public issue. Review our [Security Policy](./SECURITY.md) and report it privately to **dabananda.dev@gmail.com**.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://dmitra.netlify.app" target="_blank">Dabananda Mitra</a>
</div>
