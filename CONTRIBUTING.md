# Contributing to PortfolioCMS

Thank you for taking the time to contribute to PortfolioCMS! Whether you're fixing a bug, proposing a feature, or improving documentation, your help makes this project better for everyone.

Please read this guide fully before submitting any contributions.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Branching Strategy](#branching-strategy)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

This project adheres to our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold it. Please report unacceptable behavior to **dabananda.dev@gmail.com**.

---

## Getting Started

PortfolioCMS is built on **ASP.NET Core 10.0** using a **Clean Architecture** pattern with **Entity Framework Core** and **SQL Server**. Before contributing, make sure you're familiar with the general structure of the codebase and the conventions used across layers.

If you're unsure where to start, look for issues labeled [`good first issue`](https://github.com/dabananda/portfoliocms/issues?q=label%3A%22good+first+issue%22) or [`help wanted`](https://github.com/dabananda/portfoliocms/issues?q=label%3A%22help+wanted%22).

---

## Development Setup

### Prerequisites

Make sure you have the following installed before proceeding:

| Tool | Version / Notes |
|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download/dotnet/10.0) | 10.0 |
| SQL Server | LocalDB or a Docker container |
| IDE | Visual Studio 2022, VS Code, or JetBrains Rider |
| EF Core CLI | `dotnet tool install --global dotnet-ef` |

---

### Step 1 — Clone the Repository
```bash
git clone https://github.com/dabananda/portfoliocms.git
cd portfoliocms
```

---

### Step 2 — Configure User Secrets

The API requires several secrets to run locally. Navigate to the `PortfolioCMS.Server.Api` project directory and run:
```bash
dotnet user-secrets init

dotnet user-secrets set "JwtSettings:Secret" "YourSuperSecretKeyThatIsAtLeast32CharactersLong!"
dotnet user-secrets set "EncryptionSettings:Key" "12345678901234567890123456789012"
dotnet user-secrets set "AdminUser:Email" "admin@example.com"
dotnet user-secrets set "AdminUser:Password" "Admin@123!"
```

> ⚠️ **Important:** `EncryptionSettings:Key` must be **exactly 32 characters**. Never commit secrets to version control.

---

### Step 3 — Apply Database Migrations

Run the EF Core migrations to scaffold your local database:
```bash
dotnet ef database update \
  --project PortfolioCMS.Server.Infrastructure \
  --startup-project PortfolioCMS.Server.Api
```

If your SQL Server instance is not the default LocalDB, update the connection string in `appsettings.Development.json` before running this command.

---

### Step 4 — Run the Application
```bash
dotnet run --project PortfolioCMS.Server.Api
```

The API will be available at `https://localhost:{port}`. The Swagger UI can be accessed at `/swagger` in development mode.

---

## Project Structure

The solution follows a strict Clean Architecture layout. Please respect layer boundaries when making changes:
```
PortfolioCMS/
├── PortfolioCMS.Server.Api/            # Controllers, Middleware, Program.cs, DI setup
├── PortfolioCMS.Server.Application/    # DTOs, Interfaces, Use Cases, Mappings
├── PortfolioCMS.Server.Domain/         # Entities, Domain Exceptions, Shared Models
└── PortfolioCMS.Server.Infrastructure/ # DbContext, Migrations, Auth, Email, Token services
```

**Key rules:**
- The `Domain` layer must have **zero dependencies** on other layers or external packages.
- The `Application` layer depends only on `Domain` — never on `Infrastructure`.
- The `Api` layer orchestrates everything and is the only entry point for HTTP concerns.
- Cross-cutting concerns (logging, exception handling) belong in `Api` middleware or `Infrastructure`.

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable, production-ready code only |
| `dev` | Latest integrated features — base for most PRs |
| `feature/short-description` | New features branched off `dev` |
| `bugfix/issue-number` | Bug fixes referencing the related issue |
| `hotfix/short-description` | Critical fixes branched directly off `main` |

Always branch from `dev` unless you are submitting a hotfix. Keep branch names lowercase and hyphenated.
```bash
# Example
git checkout dev
git pull origin dev
git checkout -b feature/add-project-tags
```

---

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Every commit message must be structured as:
```
<type>(<optional scope>): <short description>
```

### Types

| Type | When to use |
|---|---|
| `feat` | Introducing a new feature |
| `fix` | Fixing a bug |
| `docs` | Documentation changes only |
| `refactor` | Code restructuring with no functional change |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, or dependency updates |
| `perf` | Performance improvements |
| `ci` | CI/CD configuration changes |

### Examples
```bash
feat(auth): add refresh token rotation support
fix(projects): resolve null reference in project query handler
docs(contributing): add database migration instructions
refactor(domain): extract base entity class to shared models
test(auth): add unit tests for JWT token generation
```

> Commit messages should be written in the **imperative mood** and kept under **72 characters** on the first line.

---

## Pull Request Process

1. **Ensure your branch is up to date** with `dev` before opening a PR:
```bash
   git fetch origin
   git rebase origin/dev
```

2. **Verify the build passes** with no errors or warnings:
```bash
   dotnet build
   dotnet test
```

3. **Fill out the PR template** completely. Incomplete PRs may be closed without review.

4. **Link the related issue** using GitHub's closing keyword (e.g., `Fixes #42`) in the PR description.

5. **Keep PRs focused.** One PR should address one concern. Large, unfocused PRs will be asked to be broken up.

6. **Request a review.** We aim to review all PRs within **48 hours** of submission.

7. **Address review feedback** by pushing additional commits to the same branch — do not close and reopen the PR.

8. Once approved, a maintainer will merge your PR using a **squash merge** to keep the history clean.

---

## Reporting Bugs

Please use the [Bug Report template](https://github.com/dabananda/portfoliocms/issues/new?template=bug_report.md) to file a new issue. Include as much detail as possible — logs from Serilog or the `ExceptionMiddleware` output are especially helpful.

Before opening a new issue, please [search existing issues](https://github.com/dabananda/portfoliocms/issues) to avoid duplicates.

---

## Requesting Features

Please use the [Feature Request template](https://github.com/dabananda/portfoliocms/issues/new?template=feature_request.md) to suggest new functionality. Describe the problem you're trying to solve and which architectural layer(s) would be affected.

---

Thank you again for contributing. Every improvement, no matter how small, makes a real difference. 🙌
