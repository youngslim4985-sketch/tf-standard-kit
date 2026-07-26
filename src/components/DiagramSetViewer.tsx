import React, { useState } from "react";
import { BrandConfig, ArchitectureProfile } from "../types";
import { Network, ShieldAlert, Database, HelpCircle, Eye, ChevronRight, Cpu } from "lucide-react";

interface DiagramSetViewerProps {
  brand: BrandConfig;
  profile: ArchitectureProfile;
  projectName: string;
}

type DiagramTab = "data-flow" | "trust-boundaries" | "failover" | "ztna-flow";

export default function DiagramSetViewer({ brand, profile, projectName }: DiagramSetViewerProps) {
  const [activeTab, setActiveTab] = useState<DiagramTab>("data-flow");
  const [selectedNode, setSelectedNode] = useState<string | null>("gateway");

  // Colors custom-tailored to the brand's config
  const accentHex = brand.accentColor;
  const secondaryHex = brand.secondaryColor;

  const renderDataFlowDiagram = () => {
    return (
      <div className="relative w-full h-[360px] bg-slate-950/80 rounded-xl border border-slate-800 p-4 overflow-hidden flex flex-col justify-between">
        {/* Dynamic Vector Connector Lines with Pulse Animations */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.2" />
              <stop offset="50%" stopColor={accentHex} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.2" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
            </marker>
          </defs>

          {/* Client to Gateway */}
          <line x1="80" y1="180" x2="220" y2="180" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
          {/* Gateway to App Service */}
          <path d="M 330 180 Q 420 180 470 180" stroke="url(#flow-grad)" strokeWidth="2.5" markerEnd="url(#arrow)" />
          {/* App Service to Cache */}
          <path d="M 520 140 Q 520 70 650 70" stroke="#334155" strokeWidth="1.5" markerEnd="url(#arrow)" />
          {/* App Service to Database */}
          <path d="M 570 180 Q 610 180 650 180" stroke="url(#flow-grad)" strokeWidth="2" markerEnd="url(#arrow)" />
          {/* App Service to AI Router (if AI Infrastructure profile) */}
          {(profile.id === "ai-infrastructure" || projectName.includes("desk")) && (
            <path d="M 520 220 Q 520 290 650 290" stroke={accentHex} strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow)" />
          )}
        </svg>

        {/* Nodes Grid */}
        <div className="relative z-10 flex h-full items-center justify-between px-4">
          
          {/* 1. Client Tier */}
          <button
            onClick={() => setSelectedNode("client")}
            className={`w-[110px] h-[90px] rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center p-2 group ${
              selectedNode === "client"
                ? "bg-slate-900 border-slate-700 shadow-lg scale-105"
                : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
            }`}
            style={{ borderColor: selectedNode === "client" ? accentHex : "" }}
          >
            <div className="p-1.5 bg-slate-800 rounded text-slate-400 group-hover:text-white transition-colors">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-sans font-medium text-slate-300">Client UI</span>
            <span className="text-[9px] font-mono text-slate-500">Iframe Safe</span>
          </button>

          {/* 2. Brand Edge Proxy */}
          <button
            onClick={() => setSelectedNode("gateway")}
            className={`w-[130px] h-[110px] rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center p-2 group ${
              selectedNode === "gateway"
                ? "bg-slate-900 border-slate-700 shadow-xl scale-105"
                : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
            }`}
            style={{ borderColor: selectedNode === "gateway" ? accentHex : "" }}
          >
            <div className="p-1.5 bg-rose-500/10 rounded text-rose-400" style={{ color: accentHex, backgroundColor: `${accentHex}15` }}>
              <Network className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-sans font-semibold text-white">{brand.name} Edge Proxy</span>
            <span className="text-[9px] font-mono text-slate-400">TLS 1.3 / JWT Ingress</span>
          </button>

          {/* 3. Compute API Core */}
          <button
            onClick={() => setSelectedNode("compute")}
            className={`w-[130px] h-[100px] rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center p-2 group ${
              selectedNode === "compute"
                ? "bg-slate-900 border-slate-700 shadow-xl scale-105"
                : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
            }`}
            style={{ borderColor: selectedNode === "compute" ? accentHex : "" }}
          >
            <div className="p-1.5 bg-slate-800 rounded text-slate-300">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-sans font-medium text-slate-200">Stateless App API</span>
            <span className="text-[9px] font-mono text-slate-400">Node Port 3000</span>
          </button>

          {/* 4. Persistence Stack (Column layout right side) */}
          <div className="flex flex-col gap-3">
            {/* Cache Node */}
            <button
              onClick={() => setSelectedNode("cache")}
              className={`w-[130px] py-1.5 px-2 rounded-md border flex items-center gap-2 transition-all ${
                selectedNode === "cache"
                  ? "bg-slate-900 border-slate-700 shadow-md scale-102"
                  : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
              }`}
              style={{ borderColor: selectedNode === "cache" ? accentHex : "" }}
            >
              <div className="p-1 bg-slate-800 rounded text-[9px] font-mono text-sky-400 font-bold uppercase">Mem</div>
              <div className="text-left">
                <p className="text-[10px] font-sans font-medium text-slate-300">Redis Cache</p>
                <p className="text-[8px] font-mono text-slate-500">Transient TTL</p>
              </div>
            </button>

            {/* Main DB Node */}
            <button
              onClick={() => setSelectedNode("database")}
              className={`w-[130px] py-2 px-2 rounded-md border flex items-center gap-2 transition-all ${
                selectedNode === "database"
                  ? "bg-slate-900 border-slate-700 shadow-md scale-102"
                  : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
              }`}
              style={{ borderColor: selectedNode === "database" ? accentHex : "" }}
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <p className="text-[10px] font-sans font-medium text-slate-300">Primary Write DB</p>
                <p className="text-[8px] font-mono text-slate-500">PostgreSQL/Firestore</p>
              </div>
            </button>

            {/* AI Node (Dynamic based on profile) */}
            {(profile.id === "ai-infrastructure" || projectName.includes("desk")) ? (
              <button
                onClick={() => setSelectedNode("ai-router")}
                className={`w-[130px] py-1.5 px-2 rounded-md border flex items-center gap-2 transition-all ${
                  selectedNode === "ai-router"
                    ? "bg-slate-900 border-slate-700 shadow-md scale-102"
                    : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
                }`}
                style={{ borderColor: selectedNode === "ai-router" ? accentHex : "" }}
              >
                <div className="p-1 bg-rose-950/40 rounded text-rose-400 text-[9px] font-mono uppercase font-bold">AI</div>
                <div className="text-left">
                  <p className="text-[10px] font-sans font-medium text-slate-300">Inference Router</p>
                  <p className="text-[8px] font-mono text-slate-500">Fallback Failover</p>
                </div>
              </button>
            ) : (
              <div className="w-[130px] h-[30px] rounded border border-dashed border-slate-900/60 flex items-center justify-center">
                <span className="text-[9px] font-mono text-slate-700">No AI Hook Required</span>
              </div>
            )}
          </div>

        </div>

        <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-900/60 pt-2 font-mono">
          <span>* Click components to view standard governance details</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Compliant Ingress Active
          </span>
        </div>
      </div>
    );
  };

  const renderTrustBoundaries = () => {
    return (
      <div className="w-full h-[360px] bg-slate-950/80 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-6 h-full items-stretch">
          {/* Boundary 1: Untrusted Client Zone */}
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1.5 text-[8px] font-mono bg-amber-500/10 text-amber-500 border-b border-l border-slate-800 uppercase tracking-wider rounded-bl">
              Public Sandbox
            </div>
            <div>
              <h4 className="text-xs font-sans font-semibold text-slate-300 mb-2">Browser / Mobile Insecure Sandbox</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                All logic executing client-side is vulnerable to reverse engineering, local code modification, and cache sniffing.
              </p>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono bg-slate-950 p-1.5 rounded border border-slate-800 text-slate-400 flex justify-between">
                  <span>Client-Side API Key</span>
                  <span className="text-rose-500 font-bold uppercase">Blocked!</span>
                </div>
                <div className="text-[10px] font-mono bg-slate-950 p-1.5 rounded border border-slate-800 text-slate-400 flex justify-between">
                  <span>Local User Storage</span>
                  <span className="text-slate-500">Preferences Only</span>
                </div>
              </div>
            </div>
            <div className="text-[9px] text-slate-500 font-mono italic">
              * Must proxy all requests to server for sensitive computation.
            </div>
          </div>

          {/* Boundary 2: Secure Server Zone */}
          <div className="border border-emerald-950/40 rounded-lg p-3 bg-slate-900/10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1.5 text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border-b border-l border-emerald-950 uppercase tracking-wider rounded-bl">
              Secure VPC Boundary
            </div>
            <div>
              <h4 className="text-xs font-sans font-semibold text-slate-200 mb-2">{brand.name} Secure Cloud Isolation</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                Private container environment executing server-side logic, protected by credentials stores and corporate VPC.
              </p>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono bg-slate-950 p-1.5 rounded border border-slate-800 text-slate-300 flex justify-between">
                  <span>process.env.GEMINI_API_KEY</span>
                  <span className="text-emerald-400">Encrypted / Hidden</span>
                </div>
                <div className="text-[10px] font-mono bg-slate-950 p-1.5 rounded border border-slate-800 text-slate-300 flex justify-between">
                  <span>Database Direct Queries</span>
                  <span className="text-emerald-400">Restricted via IAM</span>
                </div>
              </div>
            </div>
            <div className="text-[9px] text-emerald-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Zero-Knowledge client sync.
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center font-mono border-t border-slate-900/60 pt-2">
          Strict demarcation enforces security boundaries — client can never request raw schemas or execute inline SQL.
        </div>
      </div>
    );
  };

  const renderFailover = () => {
    return (
      <div className="w-full h-[360px] bg-slate-950/80 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-xs font-sans font-semibold text-white">Database Failover Sequence (Continuous Async Sync)</h4>
              <p className="text-[10px] text-slate-400">How the architecture absorbs system, database, and connection state failure.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
              <div className="text-xs font-mono font-bold text-slate-400 mb-1">Step 01</div>
              <p className="text-[11px] font-sans font-semibold text-slate-200">Replication Heartbeat</p>
              <p className="text-[9px] text-slate-500 font-mono mt-1">Primary continuously streams logs to read-replicas (lag &lt; 50ms)</p>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center relative">
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-20 text-slate-600">
                <ChevronRight className="w-4 h-4" />
              </div>
              <div className="text-xs font-mono font-bold text-rose-500 mb-1">Step 02</div>
              <p className="text-[11px] font-sans font-semibold text-slate-200">Primary Outage Detected</p>
              <p className="text-[9px] text-slate-500 font-mono mt-1">Healthchecker catches consecutive packet losses within 3 seconds</p>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
              <div className="text-xs font-mono font-bold text-emerald-400 mb-1">Step 03</div>
              <p className="text-[11px] font-sans font-semibold text-slate-200">Auto Promotion</p>
              <p className="text-[9px] text-slate-500 font-mono mt-1">Replica promoted to primary. Traffic redirected. System remains active!</p>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800/60 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Active Circuit Breaker:</strong> The primary database handles 100% of mutations, while heavy dashboards or analytics read strictly from replicas. In case of partition lag, a fail-soft routine instantly routes critical queries back to master until state convergence.
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center font-mono border-t border-slate-900/60 pt-2">
          Design patterns guarantee 99.99% availability compliant with the active <span className="text-white">{profile.name}</span> requirements.
        </div>
      </div>
    );
  };

  const renderZtnaFlow = () => {
    return (
      <div className="w-full h-[360px] bg-slate-950/80 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" style={{ color: accentHex }} />
              <h4 className="text-xs font-sans font-semibold text-white">Zero Trust Gatekeeper & Master_Hub PDP</h4>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20" style={{ color: accentHex }}>
              T-F-SOC Enforcer
            </span>
          </div>

          {/* 4 Interactive Flow Nodes */}
          <div className="grid grid-cols-4 gap-2.5 my-2">
            <button
              onClick={() => setSelectedNode("ztna-pep")}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedNode === "ztna-pep" ? "bg-slate-900 border-slate-700 shadow-md scale-102" : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
              }`}
              style={{ borderColor: selectedNode === "ztna-pep" ? accentHex : "" }}
            >
              <span className="text-[9px] font-mono font-bold text-rose-400 uppercase block mb-1">01. PEP</span>
              <p className="text-[11px] font-sans font-semibold text-slate-200 leading-snug">Ingress PEP Proxy</p>
              <p className="text-[8px] font-mono text-slate-500 mt-1">Intersects HTTP/gRPC</p>
            </button>

            <button
              onClick={() => setSelectedNode("ztna-pdp")}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedNode === "ztna-pdp" ? "bg-slate-900 border-slate-700 shadow-md scale-102" : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
              }`}
              style={{ borderColor: selectedNode === "ztna-pdp" ? accentHex : "" }}
            >
              <span className="text-[9px] font-mono font-bold text-sky-400 uppercase block mb-1">02. PDP</span>
              <p className="text-[11px] font-sans font-semibold text-slate-200 leading-snug">Master_Hub PDP</p>
              <p className="text-[8px] font-mono text-slate-500 mt-1">Policy Evaluator</p>
            </button>

            <button
              onClick={() => setSelectedNode("ztna-signals")}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedNode === "ztna-signals" ? "bg-slate-900 border-slate-700 shadow-md scale-102" : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
              }`}
              style={{ borderColor: selectedNode === "ztna-signals" ? accentHex : "" }}
            >
              <span className="text-[9px] font-mono font-bold text-amber-400 uppercase block mb-1">03. Signals</span>
              <p className="text-[11px] font-sans font-semibold text-slate-200 leading-snug">Posture & Risk</p>
              <p className="text-[8px] font-mono text-slate-500 mt-1">EDR + Anomaly Score</p>
            </button>

            <button
              onClick={() => setSelectedNode("ztna-eventbus")}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedNode === "ztna-eventbus" ? "bg-slate-900 border-slate-700 shadow-md scale-102" : "bg-slate-950/60 border-slate-900 hover:border-slate-800"
              }`}
              style={{ borderColor: selectedNode === "ztna-eventbus" ? accentHex : "" }}
            >
              <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase block mb-1">04. Event Bus</span>
              <p className="text-[11px] font-sans font-semibold text-slate-200 leading-snug">Session Revocation</p>
              <p className="text-[8px] font-mono text-slate-500 mt-1">Canonical Revoke Event</p>
            </button>
          </div>

          <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span>Canonical Revocation Event:</span>
              <span className="text-rose-400 font-bold">ztna.session.revoked</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Canonical Event Producer:</span>
              <span className="text-sky-400 font-semibold">Master_Hub</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Policy Response Effect:</span>
              <span className="text-emerald-400 font-semibold">PERMIT / DENY (with explanation_codes)</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center font-mono border-t border-slate-900/60 pt-2">
          Strict ZTNA compliance requires correlation_id and tenant_id on all emitted event envelopes.
        </div>
      </div>
    );
  };

  const getNodeDetails = () => {
    switch (selectedNode) {
      case "client":
        return {
          title: "Client UI Layer",
          desc: "Unsecure layer that is rendered in the user browser or iframe. Banned from containing static secrets or raw SQL calls.",
          complianceRule: "Rule SEC-01: Session management must utilize stateless secure tokens; no hardcoded API client secrets.",
        };
      case "gateway":
        return {
          title: `${brand.name} Edge Gateway Proxy`,
          desc: "The primary firewall and session orchestrator. Implements CORS verification, terminates TLS 1.3, and filters raw malicious JSON payloads.",
          complianceRule: "Rule AUTH-01: Inbound HTTP headers must validate JWT payload cryptography before routing downstream.",
        };
      case "compute":
        return {
          title: "Stateless App Compute Instance",
          desc: "Clustered NodeJS application processes running behind standard containers. Listens on secure port 3000.",
          complianceRule: "Rule ARCH-02: Stateless lifecycle ensures zero-dependence on local file directories; uploads stored in secure object cloud storage.",
        };
      case "cache":
        return {
          title: "Redis Memory Cache Layer",
          desc: "In-memory key-value store deployed to offload reading bottlenecks on primary databases.",
          complianceRule: "Rule CO-04: Cache invalidation keys must clear immediately on row mutations. Safe fallbacks enforce on cache misses.",
        };
      case "database":
        return {
          title: "Primary Relational / Document Database",
          desc: "The ultimate source of truth for repository status and data metrics. Deployed with row isolation.",
          complianceRule: "Rule PERSIST-01: Database must undergo continuous snapshot storage backups out-of-region with encrypted keys.",
        };
      case "ai-router":
        return {
          title: "AI Inference Router & Fallback",
          desc: "High-end LLM proxy routing inference requests to Gemini, monitoring token limits, and handling fallback to alternative models.",
          complianceRule: "Rule AI-02: Token count budget tracks RPM/TPM dynamically. Prompt injection guardrails pre-filter strings.",
        };
      case "ztna-pep":
        return {
          title: "Policy Enforcement Point (PEP)",
          desc: "Intersects all ingress API traffic. Blocks unauthenticated payloads and enforces Master_Hub policy decision tokens.",
          complianceRule: "Rule ZTNA-PEP-01: PEP must reject requests missing valid ZTNA session tokens with 403 Forbidden.",
        };
      case "ztna-pdp":
        return {
          title: "Master_Hub Policy Decision Point (PDP)",
          desc: "Central decision engine that combines identity, device posture, and risk scores to compute PERMIT/DENY responses with explanation codes.",
          complianceRule: "Rule ZTNA-PDP-01: Master_Hub is the sole authority for ztna.session.revoked and ztna.access_request.evaluated.",
        };
      case "ztna-signals":
        return {
          title: "Posture & Risk Signal Collectors",
          desc: "Collects continuous EDR device compliance scores (0-100) and contextual risk signals (e.g. impossible travel, credential stuffing).",
          complianceRule: "Rule ZTNA-SIG-01: Posture signals with compliance scores under 80 automatically downgrade session TTL.",
        };
      case "ztna-eventbus":
        return {
          title: "Canonical ZTNA Event Bus",
          desc: "Event broker publishing signed event envelopes containing correlation_id, tenant_id, timestamp, producer, and typed data payloads.",
          complianceRule: "Rule ZTNA-EVT-01: All events must use canonical schemas. ztna.session.revoked must be processed within 50ms across all edge PEP nodes.",
        };
      default:
        return {
          title: "Select an architectural component",
          desc: "Click on any node in the interactive flowchart to inspect its specifications and T&F governance requirements.",
          complianceRule: "",
        };
    }
  };

  const nodeInfo = getNodeDetails();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl" id="diagram-set-viewer">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500" style={{ color: accentHex, backgroundColor: `${accentHex}15` }}>
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-semibold text-white tracking-tight text-lg">Interactive Diagram Set</h3>
            <p className="text-xs text-slate-400">Dynamic system architecture mapping for {projectName}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setActiveTab("data-flow")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === "data-flow" ? "bg-slate-900 text-white border border-slate-800" : "text-slate-400 hover:text-white"
            }`}
          >
            Data Flow
          </button>
          <button
            onClick={() => setActiveTab("trust-boundaries")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === "trust-boundaries" ? "bg-slate-900 text-white border border-slate-800" : "text-slate-400 hover:text-white"
            }`}
          >
            Trust Boundaries
          </button>
          <button
            onClick={() => setActiveTab("failover")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === "failover" ? "bg-slate-900 text-white border border-slate-800" : "text-slate-400 hover:text-white"
            }`}
          >
            Failover
          </button>
          <button
            onClick={() => setActiveTab("ztna-flow")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
              activeTab === "ztna-flow" ? "bg-slate-900 text-rose-400 border border-slate-800 font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            ZTNA Gatekeeper
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === "data-flow" && renderDataFlowDiagram()}
          {activeTab === "trust-boundaries" && renderTrustBoundaries()}
          {activeTab === "failover" && renderFailover()}
          {activeTab === "ztna-flow" && renderZtnaFlow()}
        </div>

        <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded" style={{ color: accentHex, backgroundColor: `${accentHex}10` }}>
              Component Inspector
            </span>
            <div>
              <h4 className="text-sm font-sans font-bold text-white mb-1.5 flex items-center gap-1.5">
                {nodeInfo.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{nodeInfo.desc}</p>
            </div>

            {nodeInfo.complianceRule && (
              <div className="bg-slate-900/60 border-l-2 rounded-r-lg p-3 text-[11px]" style={{ borderLeftColor: accentHex }}>
                <p className="font-semibold text-slate-300 font-mono mb-1">Standard Governance Constraint</p>
                <p className="text-slate-400 font-sans leading-relaxed">{nodeInfo.complianceRule}</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-900/60 pt-4 mt-4">
            <h5 className="text-[10px] font-mono font-semibold uppercase text-slate-500 mb-2">Active Compliance Matrix</h5>
            <div className="space-y-1">
              {profile.requirements.map((req) => (
                <div key={req.id} className="flex items-center justify-between text-[11px] font-sans text-slate-300 bg-slate-900 px-2.5 py-1.5 rounded">
                  <span className="truncate pr-2">{req.title}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-950 rounded border border-slate-800/50 text-slate-400 shrink-0 uppercase">
                    {req.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
