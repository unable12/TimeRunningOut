import { useState, useEffect } from 'react';
import { Settings, settingsSchema, defaultSettings } from '@shared/schema';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('timeSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const validated = settingsSchema.parse(parsed);
        return validated;
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('timeSettings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
}
