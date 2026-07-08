import React from "react";
import { BrandConfig } from "../types";
import { Sliders, Palette, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";

interface BrandConfigEditorProps {
  brand: BrandConfig;
  onChange: (updated: BrandConfig) => void;
  onReset: () => void;
}

export default function BrandConfigEditor({ brand, onChange, onReset }: BrandConfigEditorProps) {
  const handleChange = (key: keyof BrandConfig, value: string) => {
    onChange({ ...brand, [key]: value });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl" id="brand-config-editor">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-semibold text-white tracking-tight text-lg">White-Label Branding</h3>
            <p className="text-xs text-slate-400">Rebrand the DevStandard Kit globally in real-time</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-700 bg-slate-950 px-2.5 py-1.5 rounded-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset to T&F
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Agency / Organization Name</label>
          <input
            type="text"
            value={brand.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors font-sans"
            placeholder="e.g. T&F Agency"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Corporate Motto</label>
          <input
            type="text"
            value={brand.motto}
            onChange={(e) => handleChange("motto", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors font-sans"
            placeholder="e.g. Craft. Standards. Execution."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Domain Website</label>
            <input
              type="text"
              value={brand.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors font-mono"
              placeholder="e.g. agency.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Distribution License</label>
            <input
              type="text"
              value={brand.license}
              onChange={(e) => handleChange("license", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors font-sans"
              placeholder="e.g. MIT Commercial"
            />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-300">Accent Colors</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">Primary Background</label>
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-md p-1.5">
                <input
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer rounded"
                />
                <span className="text-[10px] font-mono text-slate-400">{brand.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">Text Slate</label>
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-md p-1.5">
                <input
                  type="color"
                  value={brand.secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer rounded"
                />
                <span className="text-[10px] font-mono text-slate-400">{brand.secondaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">Core Accent</label>
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-md p-1.5">
                <input
                  type="color"
                  value={brand.accentColor}
                  onChange={(e) => handleChange("accentColor", e.target.value)}
                  className="w-6 h-6 border-0 bg-transparent cursor-pointer rounded"
                />
                <span className="text-[10px] font-mono text-slate-400">{brand.accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 mt-2">
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/80 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <div className="text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">White-Label Mode Enabled:</strong> Rebranding replaces all header tokens, policy emails, and licenses dynamically. This is ready for standalone packaging as <span className="text-white font-semibold">"DevStandard"</span> or resale options.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
