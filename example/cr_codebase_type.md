# example\types\react.ts
````ts
// example\types\react.ts
export type FieldType = 'text' | 'number' | 'textarea' | 'checkbox' | 'file' | 'select';

export interface FormHeader {
  title: string;
  description: string;
}

export interface FormField {
  label: string
  type: FieldType
  options?: { label: string }[] // For checkbox and select types
}

export interface Form {
  header: {
    title: string
    description: string
  }
  fields: FormField[]
}

````

