export type RiskLevel = "low" | "medium" | "high" | "inconclusive";
export type Indicator = { evidence: string; explanation: string; severity: "low" | "medium" | "high" };
export type Analysis = {
  risk_level: RiskLevel;
  confidence_label: "low" | "moderate" | "high";
  summary: string;
  indicators: Indicator[];
  recommended_actions: string[];
  limitations: string;
};
export type ScanRecord = { id: string; message: string; createdAt: string; result: Analysis };
