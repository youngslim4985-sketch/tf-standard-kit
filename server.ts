import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // API endpoint to check health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
  });

  // API endpoint to generate architecture using Gemini
  app.post("/api/generate-architecture", async (req, res) => {
    const { brand, project, description, profile } = req.body;

    if (!project || !description || !profile) {
      res.status(400).json({ error: "Missing required parameters (project, description, profile)" });
      return;
    }

    const brandName = brand?.name || "T&F";
    const brandMotto = brand?.motto || "Craft. Standards. Execution.";
    const profileName = profile?.name || "saas-product";

    const prompt = `You are an elite Staff Software Architect practicing under the strict compliance standards of "${brandName}" (Motto: "${brandMotto}").
Your goal is to scaffold a comprehensive, fully compliant ARCHITECTURE.md file for a new repository called "${project}".

Project Vertical/Context:
${description}

Selected Architecture Profile: "${profileName}" (Requirements: ${JSON.stringify(profile.requirements || [])})

Generate a production-ready, beautifully designed Markdown file.
Follow the exact guidelines below:
1. Do NOT use placeholders like "{{VARIABLE}}" or "[Insert here]". Resolve EVERYTHING into concrete architecture, names, and patterns tailored specifically for "${project}".
2. Do NOT write generic text. Create specific, detailed technical blueprints, database schemas, technology stacks, failure handling steps, and security trust boundaries.
3. Include an elegant ASCII or text-based architecture / sequence data-flow diagram directly inside a code block representing how request tokens flow.
4. Adhere strictly to the vertical (e.g. if medical/HIPAA, outline exact encryption-at-rest and audit logging specs. If Stripe payment-related, outline PCI-DSS compliance).
5. Address high-availability, caching, database replication, and specific failure modes (e.g. "What happens if downstream API is down?").

Maintain an authoritative, clinical, yet highly elegant and modern engineering voice.

Format your output strictly with these Markdown sections:
# ARCHITECTURE: ${project}
## 1. Executive Summary & Governance Alignment
## 2. Component Blueprint
## 3. Data Flow & Security Boundaries
## 4. Key Failure Modes & High-Availability
## 5. Compliance & Security Controls
## 6. Infrastructure & Deployment Specification`;

    try {
      const client = getGeminiClient();
      if (!client) {
        // Fallback if no Gemini key is provided, so the user can still preview the app seamlessly
        console.warn("GEMINI_API_KEY is not configured. Providing highly detailed static blueprint fallback.");
        const fallbackMarkdown = generateStaticFallback(project, brandName, brandMotto, profileName, description);
        res.json({ markdown: fallbackMarkdown, fallback: true });
        return;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
          systemInstruction: "You are an expert software architect who designs highly structured, rigorous, and polished architecture documents.",
        },
      });

      if (!response.text) {
        throw new Error("Empty response from Gemini API");
      }

      res.json({ markdown: response.text, fallback: false });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "Failed to generate architecture document via Gemini.",
        details: error.message || error,
        fallback: true,
        markdown: generateStaticFallback(project, brandName, brandMotto, profileName, description)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Generates a robust, highly specific static fallback document if API Key is not set or fails
function generateStaticFallback(project: string, brandName: string, brandMotto: string, profileName: string, description: string) {
  return `# ARCHITECTURE: ${project}

> **GOVERNANCE NOTICE**: This architecture blueprint is compiled under the **${brandName}** governance framework.
> **BRAND MOTTO**: *${brandMotto}*
> **COMPLIANCE PROFILE**: \`${profileName}\`

---

## 1. Executive Summary & Governance Alignment
The **${project}** system is architected as a high-performance system designed to fulfill the following product vertical requirements:
*${description}*

Aligning with the \`${profileName}\` standard-profile, the system implements rigorous schema enforcement, decoupled data storage, and strict boundary validations. Every inbound payload is filtered, sanitized, and audited at the gateway layer.

## 2. Component Blueprint
The architecture consists of three core structural boundaries:

\`\`\`
  +--------------------------------------------------------------+
  |                   Edge Gateway / Reverse Proxy               |
  |             (Ingress Filter, TLS Termination, WAF)           |
  +------------------------------+-------------------------------+
                                 | (Secure HTTPS / gRPC)
                                 v
  +------------------------------+-------------------------------+
  |                     Application Microservices                 |
  |         (Business Logic, Token Validation, Event Dispatch)   |
  +--------+---------------------+-----------------------+-------+
           | (Secure Connections)                        |
           v                                             v
  +--------+---------------------+              +-------+-------+
  |      Durable Storage         |              |  Cache Layer  |
  |  (PostgreSQL / Firestore)    |              |    (Redis)    |
  +------------------------------+              +---------------+
\`\`\`

1. **Ingress Boundary**: Implements rate-limiting, TLS 1.3 termination, and request schema authorization.
2. **Compute Tier**: Stateless nodes running clustered execution environments, scalable on-demand.
3. **Data Tier**: Primary relational/document store with read-replicas, secured via strict IAM policies and encryption-at-rest.

## 3. Data Flow & Security Boundaries
Below is the sequence describing tokenized data flows across system components:

1. **Client** initiates a request with authenticated credentials.
2. **Gateway** intercepts, validates JWT signatures, and rate-limits client IP.
3. **Service Layer** handles logic, fetching required data from **Cache** (if hit) or querying **Primary Database** (on miss).
4. **Audit Logger** synchronously records compliance states in a secure write-once-read-many (WORM) storage.
5. **Response** is packaged with custom security headers (\`Content-Security-Policy\`, \`X-Frame-Options\`) and dispatched back.

## 4. Key Failure Modes & High-Availability
To guarantee 99.99% availability, the system addresses these key failure scenarios:

| Failure Mode | Detection Mechanism | Mitigation Strategy |
| :--- | :--- | :--- |
| **Primary DB Outage** | Heartbeat probe failure (5 consecutive packet losses) | Automatic promotion of read-replica to primary. Read-only fallback activated for clients. |
| **Third-Party API Timeout** | Circuit breaker state shifts to OPEN (threshold: 5% failure rate over 10s) | Graceful degradation with cached/local fallback data. Client notifies of temporary offline mode. |
| **Traffic Spike / DDOS** | Threshold ingress monitor exceeds 5,000 req/min | Dynamic throttling & edge buffering. Auto-scaling of application pods triggered. |

## 5. Compliance & Security Controls
* **Data-at-Rest Encryption**: Standard AES-256 with KMS rotated annually.
* **Data-in-Transit Encryption**: TLS 1.3 with automated HSTS preloading.
* **Access Control**: Role-Based Access Control (RBAC) maps directly to corporate IAM directories. No API key exposure on client platforms.

## 6. Infrastructure & Deployment Specification
* **Orchestration**: Kubernetes / Managed Containers
* **Build Pipeline**: GitHub Actions standard workflow with integrated static analysis (SAST) and dependency auditing.
* **Monitoring**: OpenTelemetry exports metrics to Prometheus/Grafana with strict alerting triggers on P99 latency exceeding 400ms.`;
}

startServer();
