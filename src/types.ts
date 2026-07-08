export interface BrandConfig {
  name: string;
  motto: string;
  website: string;
  license: string;
  primaryColor: string; // Tailwind hex or class name
  secondaryColor: string;
  accentColor: string;
}

export interface ProfileRequirement {
  id: string;
  title: string;
  description: string;
  category: "Architecture" | "Data Flow" | "Security" | "Failure Mode";
}

export interface ArchitectureProfile {
  id: string;
  name: string;
  description: string;
  tagline: string;
  requirements: ProfileRequirement[];
  fileTargets: string[]; // e.g. ["ARCHITECTURE.md", "CONTRIBUTING.md", "SECURITY.md"]
}

export interface ScaffoldInputs {
  projectName: string;
  vertical: string;
  profileId: string;
  description: string;
}

export interface DocumentTemplate {
  filename: string;
  title: string;
  description: string;
  rawTemplate: string;
}

export interface CIValidationResult {
  passed: boolean;
  score: number; // 0 to 100
  checks: {
    id: string;
    title: string;
    passed: boolean;
    feedback: string;
    critical: boolean;
  }[];
}
