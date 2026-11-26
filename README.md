# Building and Securing a DevSecOps Pipeline

**Module:** IE3142 – DevOps Security  
**Institution:** Sri Lanka Institute of Information Technology (SLIIT)  
**Project:** Group project using [OWASP NodeGoat](https://github.com/OWASP/NodeGoat)

## Overview

This project demonstrates how application security practices and automated security checks can be incorporated into a development workflow. The team used OWASP NodeGoat, an intentionally vulnerable Node.js training application, as the application under assessment.

The work covered threat modelling, selected application vulnerability remediations, containerisation, and the integration of security tools into GitHub Actions.

## System architecture

The diagram below illustrates the NodeGoat deployment, including the browser-to-web application flow, the web-to-MongoDB connection, Docker boundaries, trust boundaries, and runtime configuration.

![OWASP NodeGoat deployment architecture and trust boundaries](docs/diagrams/System%20Architecture.png)

## Project work

### Threat modelling

- Developed a threat model using the **STRIDE** methodology.
- Considered threats affecting the application and its supporting components.
- Documented the application architecture, trust boundaries, and relevant data flows.

### Application security improvements

The project addressed selected weaknesses in the NodeGoat application:

| Area | Improvement |
|---|---|
| Server-Side JavaScript Injection | Replaced evaluation of user-controlled contribution values with numeric conversion and validation. |
| Stored Cross-Site Scripting (XSS) | HTML-encoded selected user-supplied profile fields before saving them. |
| Insecure Direct Object Reference (IDOR) | Used the authenticated user's session ID when retrieving allocations instead of trusting the user ID supplied in the URL. |
| Weak Password Policy | Added signup password validation requiring a minimum length and a combination of uppercase letters, lowercase letters, numbers, and special characters. |
| Regular Expression Denial of Service (ReDoS) | Simplified a regular expression to avoid the nested greedy quantifier that could cause excessive backtracking. |

These changes address selected issues for the scope of the academic project; they do not constitute a complete security review of NodeGoat.

## DevSecOps pipeline

GitHub Actions workflows automate application checks and security scans when code is pushed or pull requests are opened.

| Tool / check | Purpose | Current workflow behaviour |
|---|---|---|
| **Semgrep (SAST)** | Static analysis to identify potentially insecure code patterns. | Findings are reported; the step is configured with `continue-on-error: true`. |
| **npm audit (SCA)** | Checks project dependencies for known vulnerabilities. | Findings are reported; the step is configured with `continue-on-error: true`. |
| **Gitleaks** | Scans repository history for accidentally committed secrets. | Configured to return a non-zero exit code when a secret is detected. |
| **Trivy** | Scans the built Docker image for HIGH and CRITICAL vulnerabilities. | The scan is currently reporting-only because it uses `--exit-code 0`; unfixed findings are ignored. |
| **Cypress** | Runs the configured end-to-end test suite. | Executed through a GitHub Actions workflow. |
| **JSHint** | Performs JavaScript linting. | Executed through a GitHub Actions workflow. |

The container-security workflow also checks that the configured `COOKIE_SECRET` and `CRYPTO_KEY` GitHub Actions secrets are available to the workflow without printing their values. This availability check is not, by itself, proof of secret injection into a running container.

### Workflow files

- [SAST and dependency scanning](.github/workflows/sast-sca.yml)
- [Secrets scanning with Gitleaks](.github/workflows/secrets-scan.yml)
- [Docker build and image scanning with Trivy](.github/workflows/container-security.yml)
- [End-to-end tests](.github/workflows/e2e-test.yml)
- [Linting](.github/workflows/lint.yml)

## Run the application locally

### Prerequisites

- Docker
- Docker Compose

### Steps

1. Clone this repository:

   ```bash
   git clone https://github.com/geenuthperera/IE3142-DevSecOps-Group76.git
   cd IE3142-DevSecOps-Group76
   ```

2. Create a local environment file from the example:

   **macOS / Linux**
   ```bash
   cp .env.example .env
   ```

   **Windows PowerShell**
   ```powershell
   Copy-Item .env.example .env
   ```

3. Open `.env` and replace the placeholders with local values. For the Docker Compose setup in this repository, set the MongoDB connection string to:

   ```text
   MONGODB_URI=mongodb://mongo:27017/nodegoat
   ```

   Set unique local values for the remaining secrets and seed-user passwords. Do not commit or share your `.env` file.

4. Build and start the application:

   ```bash
   docker compose up --build
   ```

5. Open the application in your browser:

   [http://localhost:4000](http://localhost:4000)

6. Stop the containers when finished:

   ```bash
   docker compose down
   ```

## Repository structure

| Path | Description |
|---|---|
| `.github/workflows/` | GitHub Actions workflows for security scans, tests, and linting. |
| `app/` | NodeGoat application source code, routes, views, and data access code. |
| `artifacts/` | Supporting scripts and project artefacts. |
| `config/` | Application configuration. |
| `test/` | Application test files. |
| `docs/` | Project documentation and technical report. |
| `docs/diagrams/` | System architecture diagram. |

## Project documentation

- [IE3142 Group 76 Technical Report (PDF)](docs/IE3142_Group_76_Technical_Report_DevOps.pdf)
- [System architecture diagram (PNG)](docs/diagrams/System%20Architecture.png)

## Notes

This is an educational project based on an intentionally vulnerable training application. Only selected vulnerabilities were addressed as part of the project. It is not intended for production use; run it in a controlled local environment.

The application is based on [OWASP NodeGoat](https://github.com/OWASP/NodeGoat). Refer to the repository's [LICENSE](LICENSE) for licensing information.
