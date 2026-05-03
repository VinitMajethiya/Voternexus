// Election phase — derived from election-schedule.json + current date
export type ElectionPhase =
  | 'pre-election'      // > 60 days before polling day
  | 'campaign'          // 14–60 days before
  | 'election-week'     // 0–7 days before
  | 'election-day'      // polling day itself
  | 'post-election';    // after results

// Affidavit Decoder output
export interface AffidavitSummary {
  candidate_name: string;
  constituency: string;
  election_year: number;
  assets_inr: number | null;
  liabilities_inr: number | null;
  criminal_cases: CriminalCase[];
  education: string | null;
  profession: string | null;
  source_url: string;
  confidence_score: number;           // 0–100
  parsed_at: string;                  // ISO timestamp (session only, not stored)
}

export interface CriminalCase {
  ipc_section: string;
  plain_description: string;
  status: 'pending' | 'acquitted' | 'convicted' | 'unknown';
}

// Fact-check verdict
export type FactCheckVerdict =
  | 'TRUE'
  | 'PARTIALLY_TRUE'
  | 'FALSE'
  | 'UNVERIFIED'
  | 'OPINION';

export interface FactCheckResult {
  claim: string;
  verdict: FactCheckVerdict;
  explanation: string;                // 2–3 sentences, plain language
  sources: FactCheckSource[];
  confidence: number;                 // 0–100
  language_detected: string;         // BCP-47 code
}

export interface FactCheckSource {
  title: string;
  url: string;
  publisher: string;
  is_official: boolean;               // true = government/ECI source
}

// Booth location
export interface BoothLocation {
  booth_number: string;
  booth_name: string;
  address: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  is_accessible: boolean;
  queue_status: 'short' | 'moderate' | 'long' | 'unknown';
  queue_reported_at: string | null;
}

// Queue time report (submitted by user)
export interface QueueReport {
  booth_id: string;
  wait_level: 'short' | 'moderate' | 'long';
  timestamp: string;
  // No user identity fields — ever
}
