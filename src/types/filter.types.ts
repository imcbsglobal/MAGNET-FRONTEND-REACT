export interface Subject {
  code: string;
  name: string;
}

export interface AssessmentItem {
  code: string;
  name: string;
}

export interface Student {
  admission: string;
  name: string;
}

export interface FilterMetadata {
  subjects: Subject[];
  assessment_items: AssessmentItem[];
  students: Student[];
  terms: string[];
  divisions: string[];
  subperiods: string[];
  // parts: string[];
  classes: string[];
  student_count: number;
}

export interface MarksFilterState {
  class_field?: string;
  division?: string;
  subject?: string;
  term?: string;
  // part?: string;
  subperiod?: string;
  assessmentitem?: string;
  admission?: string;
  [key: string]: string | undefined;
}
