export type ComplexNumber = 1 | 2 | 3 | 4;

export interface TreatmentComplex {
  id: number;
  number: ComplexNumber;
  name: string;
  age_min_year: number;
  age_max_year: number;
  description?: string | null;
  age_groups?: number[];
}

export interface TreatmentComplexRequest {
  number: ComplexNumber;
  name: string;
  age_min_year: number;
  age_max_year: number;
  description?: string | null;
  age_groups?: number[];
}

export interface PatchedTreatmentComplexRequest {
  number?: ComplexNumber;
  name?: string;
  age_min_year?: number;
  age_max_year?: number;
  description?: string | null;
  age_groups?: number[];
}

export interface PaginatedTreatmentComplexList {
  count: number;
  next: string | null;
  previous: string | null;
  results: TreatmentComplex[];
}
