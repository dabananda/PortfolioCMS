---
name: Bug Report
about: Report a reproducible bug to help us improve PortfolioCMS
title: "[BUG] "
labels: bug
assignees: ""
---

## Bug Description

<!-- A clear and concise description of what the bug is. What went wrong? -->

---

## Steps to Reproduce

Please provide a reliable sequence of steps to reproduce the behavior:

1. 
2. 
3. 
4. 

---

## Expected Behavior

<!-- What did you expect to happen? -->

---

## Actual Behavior

<!-- What actually happened? Include any error messages, status codes, or unexpected output. -->

---

## Logs & Error Output

<!-- Paste any relevant logs below. Serilog output or ExceptionMiddleware responses are especially helpful. -->

<details>
<summary>Click to expand logs</summary>

```
Paste logs here
```

</details>

---

## API Request / Response (if applicable)

<!-- If the bug involves an API endpoint, include the request and response details. -->

**Endpoint:**
```
METHOD /api/endpoint
```

**Request Body:**
```json
```

**Response:**
```json
```

---

## Environment Details

| Field | Value |
|---|---|
| OS | e.g. Windows 11, Ubuntu 22.04 |
| IDE | e.g. Visual Studio 2022, VS Code, Rider |
| .NET Version | e.g. .NET 10.0 |
| Database | e.g. SQL Server 2022, LocalDB |
| PortfolioCMS Version | e.g. v1.0.0 |
| Deployment | e.g. Local, Docker, Self-hosted |

---

## Affected Layer / Component

<!-- Check all that apply -->

- [ ] `Api` — Controllers, Middleware, Program.cs
- [ ] `Application` — DTOs, Interfaces, Use Cases, Mappings
- [ ] `Domain` — Entities, Domain Exceptions, Shared Models
- [ ] `Infrastructure` — DbContext, Migrations, Auth, Email, Token services
- [ ] `Account Management` — Change password, update name, delete account (`/api/v1/account`)
- [ ] `File Upload` — Image or resume upload via Cloudinary (`/api/v1/upload`)
- [ ] `Portfolio Privacy` — `IsPublic` toggle or public portfolio visibility
- [ ] `Contact Notifications` — Email notification sent to portfolio owner on new message
- [ ] Other — please describe below

---

## Additional Context

<!-- Any other context, screenshots, related issues, or notes that might help us investigate. -->

---

## Possible Fix

<!-- Optional: If you have a hunch about what's causing the issue or a potential fix, describe it here. -->
