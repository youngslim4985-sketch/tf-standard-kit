T&F Command Center 

Documentation and architecture standard for the T&F software ecosystem.

This repo defines the repeatable documentation, diagram, and CI structure used across T&F projects so every product can be understood, reviewed, handed off, and scaled with a consistent engineering standard.

Purpose

T&F Standard Kit gives every repository a clean architecture package:

- Standard README structure
- Architecture documentation
- Roadmap documentation
- Draw.io diagram templates
- Decision records
- API documentation folders
- Testing documentation folders
- CI validation for required docs

Instead of every repo having a different structure, this kit creates one repeatable standard across products like Front Desk AI, The Ledger, PropOS, LineBreaker, T&F SOC, Build Agent, and Command Center.

Why It Matters

Good software is not just code. Recruiters, clients, investors, teammates, and future maintainers need to understand:

- What the system does
- How it is built
- What is production-ready
- What is planned
- How components connect
- How security and testing are handled

This kit turns documentation into an engineering asset.

Standard Repository Structure

repository/
├── README.md
├── ROADMAP.md
├── ARCHITECTURE.md
├── docs/
│   ├── diagrams/
│   │   ├── architecture.drawio
│   │   ├── deployment.drawio
│   │   ├── database.drawio
│   │   ├── sequence.drawio
│   │   ├── state-machine.drawio
│   │   └── api-flow.drawio
│   ├── decisions/
│   ├── api/
│   └── testing/
└── .github/
    └── workflows/

Core Diagrams

Each project should include:

Diagram| Purpose
System Architecture| Shows major components and service boundaries
Deployment| Shows infrastructure, hosting, CI/CD, and runtime layout
Database| Shows key tables, entities, and relationships
Sequence Flow| Shows how requests, agents, APIs, and jobs move
State Machine| Shows lifecycle logic, workflow states, and transitions
API Flow| Shows frontend, backend, integrations, and external services

Included Standards

This kit is designed to support:

- SaaS products
- AI agents
- automation platforms
- security tooling
- data platforms
- dashboards
- marketplace apps
- government/compliance-ready systems

Usage

Clone or copy this standard into a project, then add the required documentation package.

git clone https://github.com/youngslim4985-sketch/tf-standard-kit.git

Then apply the structure to a target repository:

mkdir -p docs/diagrams docs/decisions docs/api docs/testing
touch ARCHITECTURE.md ROADMAP.md

Add or update the required diagrams inside:

docs/diagrams/

Documentation Rules

Every repository should clearly separate:

- Built — what exists now
- Planned — what is on the roadmap
- Experimental — what is being tested
- Deprecated — what should not be used going forward

This prevents inflated READMEs and gives reviewers a truthful view of the project.

CI Enforcement

The standard can be enforced with GitHub Actions by checking for required files such as:

- "README.md"
- "ARCHITECTURE.md"
- "ROADMAP.md"
- "docs/diagrams/architecture.drawio"
- "docs/testing/"
- "docs/api/"

The goal is simple: every serious repo should explain itself before it scales.

Ideal Use Cases

Use this kit for:

- portfolio-grade GitHub repositories
- client-facing technical projects
- startup MVPs
- AI product documentation
- SOC/security tooling
- investor demo repos
- recruiter-ready engineering projects
- internal engineering governance

T&F Ecosystem Fit

This standard supports the larger T&F ecosystem by creating a shared technical language across all products.

Examples:

- Front Desk AI — voice agent architecture, booking state machine, integrations
- The Ledger — contract analysis pipeline, revenue waterfall, AI analysis flow
- PropOS — deal room workflow, document lifecycle, database model
- LineBreaker — sports market signal engine, API/data flow
- T&F SOC — detection pipeline, deployment architecture, security operations flow
- Build Agent — automation flow, repo governance, CI/CD structure

License

This repository is part of the T&F Investments and Holdings software ecosystem.

Owner

Built by Terrance Franklin / T&F Investments and Holdings LLC.<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/127cbbf0-769b-429d-93d2-7b308e4b6ddb

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
