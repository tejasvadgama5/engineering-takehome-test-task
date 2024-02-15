export interface ProcessData {
  name: string;
  value: number;
  standardHigher: number;
  standardLower: number;
}

export interface AbnormalData extends ProcessData {
  condition: string;
}

export interface DiagnosticMetrics {
  name: string;
  oru_sonic_codes: string;
  standard_higher: string;
  standard_lower: string;
}

export interface Conditions {
  name: string;
  diagnostic_metrics: string;
}

export interface FileData {
  oru_code: string;
  value: number;
}

export interface ObxData {
    data: Record<string, Record<string,string>>;
}
