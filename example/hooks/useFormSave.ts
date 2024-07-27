import { useState } from 'react';
import { Form } from '@/types';

// save hook for database
export function useFormSave() {
  const [isSaving, setIsSaving] = useState(false);

  const saveForm = async (formData: Form): Promise<boolean> => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save form');
      }

      return true;
    } catch (error) {
      console.error('Error saving form:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, saveForm };
}
