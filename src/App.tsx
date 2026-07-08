import React, { useState } from "react";
import { BrandConfig, ArchitectureProfile, ScaffoldInputs } from "./types";
import { DEFAULT_BRAND, STANDARD_TEMPLATES, STANDARD_PROFILES } from "./data/standards";
import BrandConfigEditor from "./components/BrandConfigEditor";
import DiagramSetViewer from "./components/DiagramSetViewer";
import DocumentViewer from "./components/DocumentViewer";
import AIScaffolder from "./components/AIScaffolder";
import { FolderOpen, FileCheck, CheckCircle2, GitBranch, Shield, Cpu, RefreshCw, LayoutGrid, HelpCircle, FileText } from "lucide-react";

export default function App() {
  const [brand, setBrand] = useState<BrandConfig>(DEFAULT_BRAND);
  const [activeProfile, setActiveProfile] = useState<ArchitectureProfile>(STANDARD_PROFILES[1]); // Default to AI Infra
  const [projectName, setProjectName] = useState<string>("front-desk-ai");

  // Load initial templates substituted with defaults
  const getInitialDocs = () => {
    const docs: { [key: string]: string } = {};
    STANDARD_TEMPLATES.forEach((tpl) => {
      let content = tpl.rawTemplate;
      content = content.replace(/{{PROJECT_NAME}}/g, "front-desk-ai");
      content = content.replace(/{{BRAND_NAME}}/g, DEFAULT_BRAND.name);
      content = content.replace(/{{BRAND_MOTTO}}/g, DEFAULT_BRAND.motto);
      content = content.replace(/{{BRAND_WEBSITE}}/g, DEFAULT_BRAND.website);
      content = content.replace(/{{PROFILE_NAME}}/g, STANDARD_PROFILES[1].name); // AI Infra
      content = content.replace(/{{PROFILE_ID}}/g, STANDARD_PROFILES[1].id);
      content = content.replace(/{{VERTICAL}}/g, "AI Medical Front Desk / Booking Agent");
      docs[tpl.filename] = content;
    });
    return docs;
  };

  const [documents, setDocuments] = useState<{ [key: string]: string }>(getInitialDocs());
  const [activeFilename, setActiveFilename] = useState<string>("ARCHITECTURE.md");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Sync complete scaffold updates
  const handleScaffoldComplete = (
    docs: { [key: string]: string },
    profile: ArchitectureProfile,
    inputs: ScaffoldInputs
  ) => {
    setDocuments(docs);
    setActiveProfile(profile);
    setProjectName(inputs.projectName);
    
    // Auto-focus the file targets list if it has the current file, otherwise focus ARCHITECTURE.md
    if (docs[activeFilename]) {
      // keep active
    } else {
      setActiveFilename("ARCHITECTURE.md");
    }
  };

  const handleBrandChange = (updatedBrand: BrandConfig) => {
    setBrand(updatedBrand);

    // Dynamic brand replacements inside existing documents in real-time!
    const updatedDocs = { ...documents };
    Object.keys(updatedDocs).forEach((key) => {
      let content = updatedDocs[key];
      // Replace references dynamically
      content = content.replace(new RegExp(brand.name, "g"), updatedBrand.name);
      content = content.replace(new RegExp(brand.motto, "g"), updatedBrand.motto);
      content = content.replace(new RegExp(brand.website, "g"), updatedBrand.website);
      updatedDocs[key] = content;
    });
    setDocuments(updatedDocs);
  };

  const handleResetBrand = () => {
    handleBrandChange(DEFAULT_BRAND);
  };

  // Mock repository file structure
  const repoFiles = [
    { name: "config/brand.yml", type: "config", label: "Brand Meta Config" },
    { name: "config/profiles.yml", type: "config", label: "Profile Ruleset" },
    { name: "ARCHITECTURE.md", type: "doc", label: "System Blueprint" },
    { name: "CONTRIBUTING.md", type: "doc", label: "Governance Guide" },
    { name: "SECURITY.md", type: "doc", label: "Security Boundary Matrix" },
    { name: "scripts/validate-standards.sh", type: "script", label: "Local CI Validator" },
  ];

  // Helper to resolve standard mock text for config and validation scripts
  const getMockFileContent = (name: string) => {
    if (name === "config/brand.yml") {
      return `# ${brand.name} Engineering Brand Configuration
# Globally inherited across all enterprise repositories

brand:
  name: "${brand.name}"
  motto: "${brand.motto}"
  domain: "${brand.website}"
  license: "${brand.license}"
  theme:
    primary: "${brand.primaryColor}"
    secondary: "${brand.secondaryColor}"
    accent: "${brand.accentColor}"`;
    }

    if (name === "config/profiles.yml") {
      return `# ${brand.name} Repository Compliance Profiles
# Enforced by the central validation engine

profiles:
  saas-product:
    tagline: "Standard Multi-Tier SaaS web apps"
    requirements:
      - jwt-ingress: "JWT proxy verification"
      - database-replication: "Async Master-replica sync"
  ai-infrastructure:
    tagline: "Compute-intensive LLM/Agent environments"
    requirements:
      - inference-router: "Secondary provider failovers"
      - token-budget: "Strict RPM/TPM limits"
  security:
    tagline: "HIPAA / PCI secure deployments"
    requirements:
      - row-level-security: "Tenant isolation"
      - WORM-logs: "Write Once Read Many audit trails"`;
    }

    if (name === "scripts/validate-standards.sh") {
      return `#!/usr/bin/env bash
# ${brand.name} DevStandard Repository Gatekeeper
# Validates compliance matrix before commits / deployment

echo "--- [${brand.name} DevStandard Engine] ---"
echo "Target Repo: ${projectName}"
echo "Active Profile: ${activeProfile.id}"

# Scan ARCHITECTURE.md for keywords
if [ ! -f "ARCHITECTURE.md" ]; then
  echo "[CRITICAL ERROR] Missing mandatory ARCHITECTURE.md file!"
  exit 1
fi

echo "Scanning compliance markers..."
checks_passed=0

case "${activeProfile.id}" in
  "saas-product")
    grep -qi "jwt" ARCHITECTURE.md && echo "[PASS] JWT check" || echo "[FAIL] Missing JWT details"
    ;;
  "ai-infrastructure")
    grep -qi "fallback" ARCHITECTURE.md && echo "[PASS] Fallback routing check" || echo "[FAIL] Missing Fallback details"
    ;;
  "security")
    grep -qi "worm" ARCHITECTURE.md && echo "[PASS] WORM audit log check" || echo "[FAIL] Missing WORM audit details"
    ;;
esac

echo "Validation completed successfully!"`;
    }

    // Default return template docs
    return documents[name] || `# Empty file: ${name}`;
  };

  const activeContent = getMockFileContent(activeFilename);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" style={{ scrollBehavior: "smooth" }}>
      {/* Top Banner Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl text-white flex items-center justify-center shadow-lg animate-pulse" style={{ backgroundColor: brand.accentColor }}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight leading-none">
                  {brand.name} DevStandard Portal
                </h1>
                <span className="text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                  v1.0 Compliance Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono italic">
                "{brand.motto}" &bull; Global White-Label Repository Controller
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right font-mono text-[10px] text-slate-500">
              <span>Environment: Production Sandbox</span>
              <span>Host Node: Port 3000 Ingress</span>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden md:block" />
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
              <span>Compliance Sync Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Side: Controls & Branding Setup (xl:col-span-4) */}
        <div className="xl:col-span-4 space-y-6">
          {/* 1. Scaffolder parameters */}
          <AIScaffolder
            brand={brand}
            onScaffoldComplete={handleScaffoldComplete}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />

          {/* 2. White-Label Branding Parameter panel */}
          <BrandConfigEditor
            brand={brand}
            onChange={handleBrandChange}
            onReset={handleResetBrand}
          />
        </div>

        {/* Right Side: Visualizers & Code Explorer (xl:col-span-8) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Interactive Workspace / Repo Explorer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl" id="workspace-explorer">
            <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-rose-500" style={{ color: brand.accentColor }} />
                <span className="text-sm font-sans font-semibold text-white tracking-tight">
                  Scaffold Repository Tree: <span className="font-mono text-xs text-rose-400" style={{ color: brand.accentColor }}>/{projectName}</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Active Profile: {activeProfile.id}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {repoFiles.map((file) => {
                const isDoc = file.type === "doc";
                const isSelected = activeFilename === file.name;
                return (
                  <button
                    key={file.name}
                    onClick={() => setActiveFilename(file.name)}
                    className={`p-2.5 text-left rounded-lg border text-xs transition-all flex items-center gap-2 group ${
                      isSelected
                        ? "bg-slate-950 border-rose-500/40 shadow-inner"
                        : "bg-slate-950/40 border-slate-850 hover:bg-slate-950 hover:border-slate-800"
                    }`}
                    style={{ borderColor: isSelected ? brand.accentColor : "" }}
                  >
                    <FileText className={`w-4 h-4 shrink-0 ${
                      isSelected ? "text-white" : isDoc ? "text-emerald-500" : "text-amber-500"
                    }`} />
                    <div className="truncate text-left">
                      <p className="font-mono text-[10px] text-slate-300 truncate leading-snug">{file.name}</p>
                      <p className="text-[8px] font-sans text-slate-500 leading-none mt-0.5 truncate">{file.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Render Active Document split viewer */}
          <DocumentViewer
            filename={activeFilename}
            content={activeContent}
            accentColor={brand.accentColor}
          />

          {/* Interactive Diagram set mapping */}
          <DiagramSetViewer
            brand={brand}
            profile={activeProfile}
            projectName={projectName}
          />

        </div>
      </main>

      {/* Corporate Compliance Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left font-sans">
            <p className="font-semibold text-slate-400 mb-1">{brand.name} DevStandard Framework v1.0</p>
            <p className="text-[11px] leading-relaxed">
              This system compiles enterprise repository stubs, visual architecture diagrams, and pipeline scripts to meet rigorous regulatory mandates.
            </p>
          </div>
          <div className="text-right font-mono text-[11px] space-y-0.5">
            <p>Protected by {brand.license} License</p>
            <p>Corporate: <a href={`https://${brand.website}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:underline">{brand.website}</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
