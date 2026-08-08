export interface ToolStat {
  label: string;
  value: string;
}

export interface ToolTransformResult {
  value: string;
  error: string | null;
  stats?: ToolStat[];
  warnings?: string[];
}

export interface ToolValidationIssue {
  message: string;
  line?: number;
  column?: number;
}

export interface ToolValidationResult {
  valid: boolean;
  error: string | null;
  issues: ToolValidationIssue[];
  stats?: ToolStat[];
}
