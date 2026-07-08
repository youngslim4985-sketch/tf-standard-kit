import React, { useState, useEffect } from "react";
import { BrandConfig, ArchitectureProfile, ScaffoldInputs, DocumentTemplate, CIValidationResult } from "../types";
import { STANDARD_PROFILES, STARTER_APPS, STANDARD_TEMPLATES } from "../data/standards";
import { Sparkles, Zap, ShieldAlert, CheckCircle2, ChevronRight, FileText, FolderCode, AlertCircle, Info } from "lucide-react";

interface AIScaffolderProps {
  brand: BrandConfig;
  onScaffoldComplete: (docs: { [key: string]: string }, selectedProfile: ArchitectureProfile, inputs: ScaffoldInputs) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
}

export default function AIScaffolder({ brand, onScaffoldComplete, isGenerating, setIsGenerating }: AIScaffolderProps) {
  const [inputs, setInputs] = useState<ScaffoldInputs>({
    projectName: "front-desk-ai",
    vertical: "AI Medical Front Desk / Booking Agent",
    profileId: "ai-infrastructure",
    description: "An autonomous AI phone agent for medical offices. Integrates with AthenaHealth EHR for appointment booking, processes copays via Stripe, handles patient queries over real-time TTS, and enforces strict HIPAA trust boundaries."
  });

  const [activeProfile, setActiveProfile] = useState<ArchitectureProfile>(
    STANDARD_PROFILES.find((p) => p.id === inputs.profileId) || STANDARD_PROFILES[1]
  );

  const [validationScore, setValidationScore] = useState<number>(100);
  const [validationChecks, setValidationChecks] = useState<CIValidationResult["checks"]>([]);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync profile details when inputs profileId changes
  useEffect(() => {
    const prof = STANDARD_PROFILES.find((p) => p.id === inputs.profileId);
    if (prof) {
      setActiveProfile(prof);
    }
  }, [inputs.profileId]);

  // Load a starter app profile
  const handleLoadStarter = (starterKey: string) => {
    const starter = STARTER_APPS.find((app) => app.projectName === starterKey);
    if (starter) {
      setInputs({
        projectName: starter.projectName,
        vertical: starter.vertical,
        profileId: starter.profileId,
        description: starter.description
      });
      setNotification({
        type: "success",
        text: `Loaded configurations for ${starter.projectName} successfully!`
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Perform a simulated check to see if custom descriptions or generated content pass our profile's standards
  const runCIComplianceChecks = (mdContent: string, profile: ArchitectureProfile) => {
    const checks: CIValidationResult["checks"] = [];
    let score = 100;

    profile.requirements.forEach((req) => {
      // Find keywords representing compliance rules
      let passed = false;
      let feedback = "";

      if (req.id === "saas-auth" && (mdContent.toLowerCase().includes("jwt") || mdContent.toLowerCase().includes("token"))) {
        passed = true;
        feedback = "JWT token authentication explicitly mapped at the edge.";
      } else if (req.id === "saas-cache" && (mdContent.toLowerCase().includes("cache") || mdContent.toLowerCase().includes("redis") || mdContent.toLowerCase().includes("memcached"))) {
        passed = true;
        feedback = "Caching layer configured for persistence efficiency.";
      } else if (req.id === "saas-rate" && (mdContent.toLowerCase().includes("limit") || mdContent.toLowerCase().includes("throttl") || mdContent.toLowerCase().includes("rate"))) {
        passed = true;
        feedback = "Rate limiting policy and retry headers declared.";
      } else if (req.id === "saas-redundancy" && (mdContent.toLowerCase().includes("replica") || mdContent.toLowerCase().includes("synchron") || mdContent.toLowerCase().includes("failover"))) {
        passed = true;
        feedback = "Primary-replica db structure explicitly configured.";
      }
      
      // AI Profile checks
      else if (req.id === "ai-routing" && (mdContent.toLowerCase().includes("fallback") || mdContent.toLowerCase().includes("router") || mdContent.toLowerCase().includes("alternative"))) {
        passed = true;
        feedback = "Model router with secondary provider triggers found.";
      } else if (req.id === "ai-moderation" && (mdContent.toLowerCase().includes("injection") || mdContent.toLowerCase().includes("moderation") || mdContent.toLowerCase().includes("guardrail"))) {
        passed = true;
        feedback = "Input/output token protection rules verified.";
      } else if (req.id === "ai-token-budget" && (mdContent.toLowerCase().includes("budget") || mdContent.toLowerCase().includes("quota") || mdContent.toLowerCase().includes("rpm") || mdContent.toLowerCase().includes("tpm"))) {
        passed = true;
        feedback = "TPM/RPM double quota budgets mapped successfully.";
      } else if (req.id === "ai-cache" && (mdContent.toLowerCase().includes("semantic") || mdContent.toLowerCase().includes("similarity") || mdContent.toLowerCase().includes("vector"))) {
        passed = true;
        feedback = "Semantic caching details listed to bypass redundant compute.";
      }

      // Security Profile checks
      else if (req.id === "sec-isolation" && (mdContent.toLowerCase().includes("separat") || mdContent.toLowerCase().includes("row-level") || mdContent.toLowerCase().includes("rls") || mdContent.toLowerCase().includes("tenant"))) {
        passed = true;
        feedback = "Strict multi-tenant Row-Level database separation detected.";
      } else if (req.id === "sec-audit" && (mdContent.toLowerCase().includes("worm") || mdContent.toLowerCase().includes("audit") || mdContent.toLowerCase().includes("write-once"))) {
        passed = true;
        feedback = "WORM audit logging standards explicitly configured.";
      } else if (req.id === "sec-key-rot" && (mdContent.toLowerCase().includes("kms") || mdContent.toLowerCase().includes("rotation") || mdContent.toLowerCase().includes("encrypt"))) {
        passed = true;
        feedback = "Automatic master KMS envelope encryption mapped.";
      } else if (req.id === "sec-fail-safe" && (mdContent.toLowerCase().includes("fail") || mdContent.toLowerCase().includes("credential") || mdContent.toLowerCase().includes("close"))) {
        passed = true;
        feedback = "Credential loss fail-closed standard declared.";
      }

      // Fallback/Generic passes
      else if (req.id.startsWith("min")) {
        passed = true;
        feedback = "Stateless container rules validated.";
      } else {
        feedback = `Missing detail: Ensure document addresses "${req.title}".`;
        score -= 25;
      }

      checks.push({
        id: req.id,
        title: req.title,
        passed,
        feedback,
        critical: req.category === "Security" || req.category === "Failure Mode"
      });
    });

    setValidationScore(Math.max(10, score));
    setValidationChecks(checks);
  };

  // Fast Instant Scaffold (Template Substitution)
  const handleFastScaffold = () => {
    setIsGenerating(true);
    const substitutedDocs: { [key: string]: string } = {};

    setTimeout(() => {
      STANDARD_TEMPLATES.forEach((tpl) => {
        let content = tpl.rawTemplate;
        content = content.replace(/{{PROJECT_NAME}}/g, inputs.projectName);
        content = content.replace(/{{BRAND_NAME}}/g, brand.name);
        content = content.replace(/{{BRAND_MOTTO}}/g, brand.motto);
        content = content.replace(/{{BRAND_WEBSITE}}/g, brand.website);
        content = content.replace(/{{PROFILE_NAME}}/g, activeProfile.name);
        content = content.replace(/{{PROFILE_ID}}/g, activeProfile.id);
        content = content.replace(/{{VERTICAL}}/g, inputs.vertical);
        substitutedDocs[tpl.filename] = content;
      });

      // Run validation checker against ARCHITECTURE.md
      runCIComplianceChecks(substitutedDocs["ARCHITECTURE.md"], activeProfile);

      onScaffoldComplete(substitutedDocs, activeProfile, inputs);
      setIsGenerating(false);
      setNotification({
        type: "success",
        text: "Scaffolded instantly with standards placeholders!"
      });
      setTimeout(() => setNotification(null), 3000);
    }, 600);
  };

  // AI Co-pilot Scaffold (Calling Gemini API)
  const handleAICopilotScaffold = async () => {
    setIsGenerating(true);
    setNotification(null);

    try {
      const response = await fetch("/api/generate-architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          project: inputs.projectName,
          description: inputs.description,
          profile: activeProfile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate blueprint.");
      }

      const generatedDocs: { [key: string]: string } = {};

      // Load main document from Gemini response
      generatedDocs["ARCHITECTURE.md"] = data.markdown;

      // Rest of files loaded via template substitution (Contributing & Security)
      STANDARD_TEMPLATES.forEach((tpl) => {
        if (tpl.filename !== "ARCHITECTURE.md") {
          let content = tpl.rawTemplate;
          content = content.replace(/{{PROJECT_NAME}}/g, inputs.projectName);
          content = content.replace(/{{BRAND_NAME}}/g, brand.name);
          content = content.replace(/{{BRAND_MOTTO}}/g, brand.motto);
          content = content.replace(/{{BRAND_WEBSITE}}/g, brand.website);
          content = content.replace(/{{PROFILE_NAME}}/g, activeProfile.name);
          content = content.replace(/{{PROFILE_ID}}/g, activeProfile.id);
          content = content.replace(/{{VERTICAL}}/g, inputs.vertical);
          generatedDocs[tpl.filename] = content;
        }
      });

      // Run validator check on the AI text output to see how well it satisfies active rules!
      runCIComplianceChecks(data.markdown, activeProfile);

      onScaffoldComplete(generatedDocs, activeProfile, inputs);

      setNotification({
        type: "success",
        text: data.fallback
          ? "Mock blueprints loaded successfully (Gemini key pending)."
          : "AI Co-pilot scaffold generated successfully!"
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      console.error(err);
      setNotification({
        type: "error",
        text: `AI Generation failed: ${err.message || "Endpoint error"}`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6" id="ai-scaffolder">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-sans font-semibold text-white tracking-tight text-lg">Standards Scaffolder</h3>
        <p className="text-xs text-slate-400">Generate fully compliant repositories matching standard profiles</p>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2.5 text-xs font-medium border ${
            notification.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Quick Starter Apps */}
      <div>
        <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 tracking-wider block mb-2">
          Demo Starter Scenarios (Hiring Push)
        </span>
        <div className="grid grid-cols-3 gap-2">
          {STARTER_APPS.map((app) => (
            <button
              key={app.projectName}
              onClick={() => handleLoadStarter(app.projectName)}
              className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                inputs.projectName === app.projectName
                  ? "bg-slate-950 border-rose-500/50"
                  : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-950 hover:border-slate-800"
              }`}
              style={{ borderColor: inputs.projectName === app.projectName ? brand.accentColor : "" }}
            >
              <p className="font-semibold text-slate-200 font-sans truncate">{app.projectName}</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{app.vertical}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Repo parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Repository Name</label>
            <input
              type="text"
              value={inputs.projectName}
              onChange={(e) => setInputs({ ...inputs, projectName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Product Vertical</label>
            <input
              type="text"
              value={inputs.vertical}
              onChange={(e) => setInputs({ ...inputs, vertical: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors font-sans"
            />
          </div>
        </div>

        {/* Selected Profile Selection */}
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Active Governance Profile</label>
          <div className="grid grid-cols-2 gap-2">
            {STANDARD_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setInputs({ ...inputs, profileId: p.id })}
                className={`p-3 text-left rounded-lg border transition-all ${
                  inputs.profileId === p.id
                    ? "bg-slate-950 border-rose-500/40 shadow-inner"
                    : "bg-slate-950/20 border-slate-800 hover:border-slate-700"
                }`}
                style={{ borderColor: inputs.profileId === p.id ? brand.accentColor : "" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white font-sans">{p.name}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{p.tagline}</p>
              </button>
            ))}
          </div>
        </div>

        {/* System description */}
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2 flex justify-between">
            <span>App Blueprint & Components</span>
            <span className="text-[10px] text-slate-500 font-mono">Guides AI architect decisions</span>
          </label>
          <textarea
            value={inputs.description}
            onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-lg p-3 text-xs text-white focus:outline-none transition-colors font-sans leading-relaxed"
            placeholder="Describe your components, database layers, and external service hooks..."
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">
          <button
            onClick={handleFastScaffold}
            disabled={isGenerating}
            className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Fast Substitution
          </button>

          <button
            onClick={handleAICopilotScaffold}
            disabled={isGenerating}
            className="w-full text-white rounded-lg py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: brand.accentColor }}
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            {isGenerating ? "Co-Pilot Architecting..." : "AI Co-Pilot Scaffolder"}
          </button>
        </div>

        {/* Dynamic validation card */}
        {validationChecks.length > 0 && (
          <div className="bg-slate-950 border border-slate-850 rounded-lg p-4 mt-2">
            <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-2">
              <span className="text-[11px] font-mono text-slate-400">CI Standards Validation Checks</span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                validationScore >= 80 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              }`}>
                Score: {validationScore}%
              </span>
            </div>
            <div className="space-y-2">
              {validationChecks.map((check) => (
                <div key={check.id} className="flex items-start gap-2.5 text-xs">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-300 leading-snug">{check.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-sans leading-relaxed">{check.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
