export type SectionGroupedExercise = {
  name: string;
  percentage: number;
  age_groups: {
    id: number;
    name: string;
    exercises: {
      id: number;
      name: string;
    }[];
  }[];
}

export type DiagnosticAnswer = {
  exercise: number;
  exercise_name: string;
  section_name: string;
  age_group_name: string;
  score: number; // 0.0, 0.5, 1.0
}

export type DiagnosticResult = {
  id: number;
  child: number;
  specialist: number | null;
  specialist_name: string;
  date: string; // ISO DateTime
  comment: string | null;
  answers: DiagnosticAnswer[];
}

export type DiagnosticAnswerRequest = {
  exercise: number;
  score: number | string;
}

export type DiagnosticResultRequest = {
  child: number;
  comment?: string | null;
  answers: DiagnosticAnswerRequest[];
}

export const __is_diagnostics_types = true;
