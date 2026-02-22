<div align="center">

# PortfolioCMS

**A modern, developer-first SaaS Portfolio Management System**
built with ASP.NET Core 10 and Clean Architecture.

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/download/dotnet/10.0)
[![EF Core](https://img.shields.io/badge/EF%20Core-10.0-512BD4?style=flat-square)](https://learn.microsoft.com/en-us/ef/core/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](./CONTRIBUTING.md)

[Getting Started](#getting-started) · [Features](#features) · [Architecture](#architecture) · [Contributing](#contributing) · [License](#license)

</div>

---

## Overview

PortfolioCMS is an open-source, API-first content management system designed to let developers and creatives **build, manage, and serve their portfolio content** through a clean, secure REST API — without being locked into a rigid front-end.

Built on **ASP.NET Core 10** with a strict **Clean Architecture** separation of concerns, PortfolioCMS is designed to be maintainable, testable, and extensible from day one. Whether you're powering a personal portfolio site or a multi-user SaaS platform, PortfolioCMS gives you the backend infrastructure to do it confidently.

---

## Features

- 🔐 **JWT Authentication** with secure refresh token rotation
- 🔒 **AES Encryption** for sensitive data fields
- 👤 **Role-based authorization** with a seeded admin user
- 📁 **Portfolio & Project management** via a structured REST API
- 🧱 **Clean Architecture** — Domain, Application, Infrastructure, and API layers strictly separated
- 🗃️ **Entity Framework Core** with SQL Server and full migration support
- 📋 **Structured logging** via Serilog
- ⚠️ **Global exception handling** middleware for consistent API error responses

---

## Architecture

PortfolioCMS follows a Clean Architecture pattern. Dependencies flow strictly inward — outer layers depend on inner layers, never the reverse.
```
PortfolioCMS/
├── PortfolioCMS.Server.Api/            # HTTP layer: Controllers, Middleware, DI setup
├── PortfolioCMS.Server.Application/    # Use cases: DTOs, Interfaces, Mappings
├── PortfolioCMS.Server.Domain/         # Core: Entities, Domain Exceptions, Shared Models
└── PortfolioCMS.Server.Infrastructure/ # External: DbContext, Migrations, Auth, Email, Token
```
```
[ Api ] → [ Application ] → [ Domain ]
                ↑
       [ Infrastructure ]
```

> `Domain` has zero external dependencies. `Application` depends only on `Domain`. `Infrastructure` implements `Application` interfaces. `Api` wires everything together.

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download/dotnet/10.0) | 10.0 or later |
| SQL Server | LocalDB or Docker |
| EF Core CLI | `dotnet tool install --global dotnet-ef` |

---

### 1. Clone the Repository
```bash
git clone https://github.com/dabananda/portfoliocms.git
cd portfoliocms
```

### 2. Configure User Secrets

Navigate to the `PortfolioCMS.Server.Api` directory and set up the required secrets:
```bash
dotnet user-secrets init

dotnet user-secrets set "JwtSettings:Secret" "YourSuperSecretKeyThatIsAtLeast32CharactersLong!"
dotnet user-secrets set "EncryptionSettings:Key" "12345678901234567890123456789012"
dotnet user-secrets set "AdminUser:Email" "admin@example.com"
dotnet user-secrets set "AdminUser:Password" "Admin@123!"
```

> ⚠️ `EncryptionSettings:Key` must be **exactly 32 characters**. Never commit secrets to source control.

### 3. Apply Database Migrations
```bash
dotnet ef database update --project PortfolioCMS.Server.Infrastructure --startup-project PortfolioCMS.Server.Api
```

### 4. Run the Application
```bash
dotnet run --project PortfolioCMS.Server.Api
```

The API will be available at `https://localhost:{port}`.
Swagger UI is accessible at `https://localhost:{port}/swagger` in development mode.

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
