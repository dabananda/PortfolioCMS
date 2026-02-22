# Security Policy

## Supported Versions

We actively maintain and release security updates for the following versions of PortfolioCMS:

| Version | Supported          |
|---------|--------------------|
| v1.x.x  | ✅ Actively supported |
| < 1.0   | ❌ No longer supported |

If you are running an unsupported version, we strongly recommend upgrading to the latest stable release to ensure you receive security patches.

---

## Reporting a Vulnerability

We take the security of PortfolioCMS and its users seriously. If you believe you have found a security vulnerability in this project, **please do not disclose it publicly** through a GitHub issue, pull request, or discussion thread.

Instead, please report it responsibly via email:

📧 **dabananda.dev@gmail.com**

Use the subject line: `[SECURITY] Vulnerability Report — PortfolioCMS`

---

### What to Include in Your Report

To help us triage and resolve the issue as quickly as possible, please provide as much of the following as you can:

- **Description** — A clear explanation of the vulnerability and its potential impact.
- **Affected component** — Which layer or module is affected (e.g., `Infrastructure/Auth`, `Api/Middleware`, JWT handling, encryption, etc.).
- **Steps to reproduce** — A minimal, reliable reproduction path. Include HTTP requests, payloads, or code snippets where applicable.
- **Proof of concept** — If available, a PoC that demonstrates the vulnerability without causing harm.
- **Suggested mitigation** — Any fixes or workarounds you have identified, if applicable.

The more detail you provide, the faster we can respond and resolve the issue.

---

## Response Timeline

Once we receive your report, we commit to the following:

| Stage | Timeframe |
|---|---|
| Acknowledgement of receipt | Within **48 hours** |
| Initial assessment & severity triage | Within **5 business days** |
| Fix development & testing | Dependent on complexity |
| Patch release & security advisory | As soon as the fix is validated |

We will keep you informed throughout the process and credit you in the security advisory unless you prefer to remain anonymous.

---

## Disclosure Policy

PortfolioCMS follows a **coordinated disclosure** model:

1. You report the vulnerability to us privately.
2. We investigate, develop a fix, and prepare a security advisory.
3. We release the patched version.
4. We publish the security advisory publicly, crediting the reporter.

We kindly ask that you give us a reasonable window to address the vulnerability before any public disclosure. We aim to resolve all confirmed vulnerabilities before they are publicly disclosed.

---

## Scope

The following are considered **in scope** for security reports:

- Authentication and authorization flaws (JWT, refresh tokens, role bypass)
- Cryptographic weaknesses (AES encryption, key management)
- Injection vulnerabilities (SQL injection, command injection)
- Sensitive data exposure through API responses
- Broken access control across portfolio or user resources
- Security misconfigurations in middleware or DI setup

The following are considered **out of scope**:

- Vulnerabilities in third-party dependencies (report these to the respective maintainers)
- Issues in unsupported versions (< v1.0)
- Social engineering attacks
- Denial of service (DoS) attacks without a clear code-level root cause
- Issues requiring physical access to the server

---

## Security Best Practices for Self-Hosted Deployments

If you are running PortfolioCMS in your own environment, we recommend the following:

- **Never commit secrets** to version control. Use environment variables or a secrets manager.
- **Rotate your JWT secret and encryption key** regularly and store them securely.
- Keep your **.NET runtime and NuGet dependencies up to date** to patch known CVEs.
- Run the application **behind a reverse proxy** (e.g., Nginx, Caddy) with HTTPS enforced.
- **Restrict database access** to only the application service account with least-privilege permissions.
- Enable **audit logging** via Serilog and monitor for unusual activity.

---

## Attribution

We are grateful to the security researchers and community members who help keep PortfolioCMS secure. Responsible disclosures will be acknowledged in our release notes and security advisories.

Thank you for helping us build a safer platform. 🔐
