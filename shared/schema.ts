import { z } from "zod";

// Settings schema for local storage
export const settingsSchema = z.object({
  timeFormat: z.enum(['12h', '24h']),
  weekStart: z.enum(['sunday', 'monday']),
  visualStyle: z.enum(['dots', 'bars'])
});

export type Settings = z.infer<typeof settingsSchema>;

export const defaultSettings: Settings = {
  timeFormat: '24h',
  weekStart: 'monday',
  visualStyle: 'dots'
};
