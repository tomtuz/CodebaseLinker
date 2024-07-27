export type FieldType = 'text' | 'number' | 'textarea' | 'checkbox' | 'file' | 'select';

export interface FormHeader {
  title: string;
  description: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  value: string | number | boolean | File | null;
  options?: string[];
  required?: boolean;
}

export interface Form {
  id: string;
  header: FormHeader
  fields: FormField[];
}
