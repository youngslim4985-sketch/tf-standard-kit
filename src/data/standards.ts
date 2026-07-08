import { BrandConfig, ArchitectureProfile, DocumentTemplate } from "../types";

export const DEFAULT_BRAND: BrandConfig = {
  name: "T&F",
  motto: "Craft. Standards. Execution.",
  website: "build.tf.agency",
  license: "MIT Commercial White-Label",
  primaryColor: "#0f172a", // Slate 900
  secondaryColor: "#64748b", // Slate 500
  accentColor: "#f43f5e", // Rose 500 (T&F Red/Rose style)
};

export const STANDARD_PROFILES: ArchitectureProfile[] = [
  {
    id: "saas-product",
    name: "SaaS Product Profile",
    tagline: "Highly scalable consumer or B2B SaaS web applications",
    description: "Required for standard SaaS apps. Demands stateless client-server split, secure JWT sessions, strict CORS boundaries, read-replicas, and edge CDN cache optimization.",
    fileTargets: ["ARCHITECTURE.md", "CONTRIBUTING.md", "SECURITY.md"],
    requirements: [
      {
        id: "saas-auth",
        title: "JWT Ingress Boundary",
        description: "Must explicitly declare token verification at the reverse proxy or API gateway layer.",
        category: "Security",
      },
      {
        id: "saas-cache",
        title: "Multi-Tier Caching",
        description: "Specify Redis/Memcached cache invalidation logic for DB load mitigation.",
        category: "Architecture",
      },
      {
        id: "saas-rate",
        title: "Ingress Throttling",
        description: "Specify maximum requests/IP and backoff headers (e.g., Retry-After).",
        category: "Security",
      },
      {
        id: "saas-redundancy",
        title: "Primary-Replica DB Sync",
        description: "Database must configure continuous asynchronous replication with automated fallback failover triggers.",
        category: "Failure Mode",
      },
    ],
  },
  {
    id: "ai-infrastructure",
    name: "AI & Model Infrastructure Profile",
    tagline: "Compute-intensive, LLM/Agent-driven platforms",
    description: "Specialized for AI and LLM apps. Mandates token tracking, prompt-injection filters, model fallback routers, streaming timeout mitigations, and semantic caching.",
    fileTargets: ["ARCHITECTURE.md", "CONTRIBUTING.md", "SECURITY.md"],
    requirements: [
      {
        id: "ai-routing",
        title: "Inference Router & Fallback",
        description: "Specify alternative model endpoints if primary providers experience elevated latency or 5xx.",
        category: "Failure Mode",
      },
      {
        id: "ai-moderation",
        title: "Prompt Injection & Safe Boundaries",
        description: "Mandatory system prompt enforcement and visual moderation checks on inbound/outbound tokens.",
        category: "Security",
      },
      {
        id: "ai-token-budget",
        title: "Token Quota Rate Limiter",
        description: "Define separate rate limit pools for token usage (TPM) in addition to requests (RPM).",
        category: "Architecture",
      },
      {
        id: "ai-cache",
        title: "Semantic Cache Layer",
        description: "Define vector similarity-based caching parameters for highly redundant queries to conserve GPU compute.",
        category: "Architecture",
      },
    ],
  },
  {
    id: "security",
    name: "Enterprise Security & Compliance Profile",
    tagline: "High-security banking, health (HIPAA), or PCI-DSS services",
    description: "Strict profile for regulated systems. Requires multi-tenant DB isolation, field-level encryption, physical HSM keys, immutable audit trails, and strict PII access boundaries.",
    fileTargets: ["ARCHITECTURE.md", "CONTRIBUTING.md", "SECURITY.md", "COMPLIANCE.md"],
    requirements: [
      {
        id: "sec-isolation",
        title: "Logical Tenant Separation",
        description: "Must employ Row-Level Security (RLS) or separate physical databases for multi-tenant data structures.",
        category: "Security",
      },
      {
        id: "sec-audit",
        title: "WORM Audit Logging",
        description: "Audit logs must be written to Write-Once-Read-Many (WORM) storage with cryptographic sealing.",
        category: "Security",
      },
      {
        id: "sec-key-rot",
        title: "KMS & Envelope Encryption",
        description: "Encrypt database fields with unique keys wrapped by a master key rotated automatically every 90 days.",
        category: "Security",
      },
      {
        id: "sec-fail-safe",
        title: "Zero-Knowledge Storage Failures",
        description: "System must fail-closed on credentials loss; no raw text recovery pathways.",
        category: "Failure Mode",
      },
    ],
  },
  {
    id: "minimal",
    name: "Minimalist MVP Profile",
    tagline: "Single-container prototypes or internal service utilities",
    description: "Relaxed standards for rapid deployments. Permits unified single-database nodes, transient file storage, and lightweight basic auth with minimal replication requirements.",
    fileTargets: ["ARCHITECTURE.md"],
    requirements: [
      {
        id: "min-stateless",
        title: "Stateless Container Lifecycle",
        description: "All uploaded user assets must exist in external block storage, not on local disk.",
        category: "Architecture",
      },
      {
        id: "min-backup",
        title: "Snapshot Backup Frequency",
        description: "Daily automated database backups persisted out-of-region with 14-day retention.",
        category: "Failure Mode",
      },
    ],
  },
];

export const STARTER_APPS = [
  {
    projectName: "front-desk-ai",
    vertical: "AI Medical Front Desk / Booking Agent",
    profileId: "ai-infrastructure",
    description: "An autonomous AI phone agent for medical offices. Integrates with AthenaHealth EHR for appointment booking, processes copays via Stripe, handles patient queries over real-time TTS, and enforces strict HIPAA trust boundaries.",
  },
  {
    projectName: "governance-core",
    vertical: "Enterprise Policy Engine",
    profileId: "security",
    description: "An automated compliance tracker for multi-tenant software deployments. Validates infrastructure states, records immutable audit trails on Firestore, and blocks unauthorized deployments through a Git-hook validator.",
  },
  {
    projectName: "tf-commerce-api",
    vertical: "Next-Gen SaaS E-commerce API",
    profileId: "saas-product",
    description: "High-performance headless e-commerce backend. Powers real-time inventory queries, aggregates cart metrics via multi-region Redis, processes checkout events via asynchronous queues, and handles millions of requests during peak product drops.",
  },
];

export const STANDARD_TEMPLATES: DocumentTemplate[] = [
  {
    filename: "ARCHITECTURE.md",
    title: "System Architecture Blueprint",
    description: "Defines components, data flows, failure modes, and security controls.",
    rawTemplate: `# ARCHITECTURE: {{PROJECT_NAME}}

> **GOVERNANCE NOTICE**: This document serves as the single source of truth for the system architecture of **{{PROJECT_NAME}}**.
> **BRAND STANDARDS**: Maintained under the **{{BRAND_NAME}}** standards framework (*{{BRAND_MOTTO}}*).
> **ACTIVE COMPLIANCE PROFILE**: \`{{PROFILE_NAME}}\`
> **VERTICAL DEFINITION**: \`{{VERTICAL}}\`

---

## 1. Executive Summary & Governance Alignment
**{{PROJECT_NAME}}** is built to satisfy the business rules and constraints of a **{{VERTICAL}}**.
Architected to adhere strictly to the \`{{PROFILE_NAME}}\` specification:
- Enforces strict component boundaries and data sanitization.
- Minimizes external trust footprints while maximizing execution transparency.
- Integrates continuous monitoring and strict fail-soft thresholds.

## 2. Component Blueprint
The system layout separates concerns into highly insulated boundaries, utilizing the custom **{{BRAND_NAME}}** standard network gateway:

\`\`\`
  [ Client Tier ] 
        |  (Encrypted HTTPS / TLS 1.3)
        v
  [ {{BRAND_NAME}} Edge Proxy ] --(Terminates TLS, Validates Token)--> [ API Gateway ]
                                                                        |
                                                 +----------------------+----------------------+
                                                 |                                             |
                                                 v                                             v
                                        [ Compute Cluster ]                           [ AI Inference Router ]
                                        - Stateless API Pods                          - Model Fallbacks
                                                 |                                             |
                                                 +----------------------+----------------------+
                                                                        |
                                                                        v
                                                               [ Storage Fabric ]
                                                               - Main Relational DB (Write)
                                                               - Replication DB (Read-Only)
                                                               - Memory Cache (Redis)
\`\`\`

- **Edge Proxy Layer**: Implements strict security header injection and early request filtering.
- **Compute Layer**: Stateless clustered processes, adhering strictly to horizontal scalability rules.
- **AI Gateway (Model Ingress)**: Acts as the proxy for external intelligence calls, validating prompt injection limits.
- **Persistence Fabric**: Secure read-replica layout ensuring read-heavy workloads never bottleneck transaction logs.

## 3. Data Flow & Security Boundaries
A typical transaction follows a locked down operational sequence:

1. **Request Ingress**: Client requests route through the edge filter. Inbound schemas are validated against strict JSON definitions.
2. **Identity Verification**: Requests are certified using JWT cryptographically-signed keys. Stale tokens trigger immediate \`401 Unauthorized\`.
3. **Internal Orchestration**: Service layers resolve queries, interacting through gRPC internally to protect network hops.
4. **Data Mutability**: State updates occur strictly within transaction barriers on the master primary DB, with hot replicas reflecting updates asynchronously in under 50ms.
5. **Egress Headers**: Responses are finalized with standard security policies.

## 4. Key Failure Modes & High-Availability
The architecture respects that failure is a runtime inevitability. The table below represents the active mitigation controls:

| Event ID | failure Event | active Detection | automated Mitigation |
| :--- | :--- | :--- | :--- |
| **FAIL-01** | Downstream Provider Timeout | Circuit Breaker shifts to Open state | Graceful degradation. Render cached values and notify client of temporary read-only state. |
| **FAIL-02** | Database Replica Lag | Replication delay checker exceeds 100ms | Divert all read queries to primary database until replica synchronization catches up. |
| **FAIL-03** | Rate-Limit Threshold Breach | Token bucket counters deplete | Reject traffic with code \`429 Too Many Requests\` and set \`Retry-After\` backoff headers. |

## 5. Compliance & Security Controls
In strict compliance with the **{{BRAND_NAME}}** standards, the platform maintains:
- **Secrets Encryption**: Zero hardcoded credentials. All API keys loaded via secure environment stores.
- **Key Rotation**: Cryptographic master keys are rotated via secure Key Management Services (KMS).
- **Audit Trails**: Non-repudiation logging for all state changes.

## 6. Infrastructure & Deployment Specification
- **Engine**: Fully containerized runtime (Docker / Cloud Run) bound strictly to port \`3000\`.
- **CI Pipelines**: Validated on every commit against the \`{{BRAND_NAME}} CI standards validation\` script, blocking builds on undocumented external dependencies.
- **Telemetry**: OpenTelemetry reporting system health directly to unified dashboards.`,
  },
  {
    filename: "CONTRIBUTING.md",
    title: "Contributor & Standards Compliance Guide",
    description: "Explains standards verification, code review rules, and commit standards.",
    rawTemplate: `# CONTRIBUTING TO {{PROJECT_NAME}}

Welcome! Thank you for contributing to **{{PROJECT_NAME}}**. 
This project is governed by the **{{BRAND_NAME}}** Engineering Standards (*{{BRAND_MOTTO}}*). All development activities must align with the active compliance profile: \`{{PROFILE_NAME}}\`.

---

## 1. Governance & Standards Verification
Before opening a pull request, your branch **MUST** pass the CI compliance validation scan. The standards workflow validates that:
1. No undocumented external APIs are imported.
2. The core system architecture layout defined in \`ARCHITECTURE.md\` is not violated.
3. Every public endpoint is properly bounded by a rate-limiting policy.

To run the local verification check:
\`\`\`bash
./scripts/validate-standards.sh --profile {{PROFILE_ID}}
\`\`\`

## 2. Commit Message Structure
We enforce strict commit styling to maintain an easily auditable changelog:
- **feat(core)**: New core component matching architectural guidelines.
- **fix(sec)**: Patches addressing security vulnerabilities or isolation bounds.
- **docs(arch)**: Upgrades or revisions to the \`ARCHITECTURE.md\` files.

Every commit **MUST** reference an approved RFC or Architecture issue.

## 3. Review Process
- All submissions require reviews from at least two certified Software Architects.
- Reviewers look specifically for: state contamination, unhandled downstream failures, and database transaction lock escalations.`,
  },
  {
    filename: "SECURITY.md",
    title: "Security & Vulnerability Disclosure Policy",
    description: "Defines vulnerability reporting, trust boundaries, and encrypt specifications.",
    rawTemplate: `# SECURITY POLICY: {{PROJECT_NAME}}

This policy defines the security posture, vulnerability reporting protocols, and structural trust boundaries of **{{PROJECT_NAME}}**, governed under the **{{BRAND_NAME}}** security guidelines.

---

## 1. General Trust Posture
- **Default Deny**: All ports are blocked unless explicitly documented as open. 
- **Least Privilege**: Microservices operate with minimal required IAM permissions. Databases utilize row-level isolation policies.
- **No Client Secrets**: API keys, database credentials, and symmetric signing keys must never be exposed to browser clients.

## 2. Active Compliance Matrix (\`{{PROFILE_NAME}}\`)
For this repository, the following rules are strictly enforced:
- **Transport Encryption**: All transactions must terminate at TLS 1.3. Internal networks route via TLS 1.2 minimum.
- **At-Rest Protection**: Disk arrays are encrypted using AES-256 with KMS keys.
- **Audit Logging**: Any structural state changes (writes, deletes) require synchronous logging.

## 3. Reporting a Vulnerability
Please do not open GitHub issues for security vulnerabilities. Instead, submit securely:
- **Email**: security@{{BRAND_WEBSITE}}
- **Response window**: The security team will acknowledge receipt within 24 hours and provide an initial impact assessment within 72 hours.
- **Bounty Program**: Elite, confirmed vulnerabilities are eligible for the **{{BRAND_NAME}}** White-Label Bug Bounty program.`,
  },
];
