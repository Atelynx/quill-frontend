import { z } from 'zod';

export const AdminConfigSchema = z.object({
  key: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]),
  name: z.string().optional(),
  tags: z.array(z.string()).optional(),
  inUse: z.boolean(),
  lastUsedAt: z.string().datetime().nullable().optional(),
  appliesOn: z.enum(['restart']).optional(),
  effectiveValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AdminConfig = z.infer<typeof AdminConfigSchema>;

export const AdminConfigHistorySchema = AdminConfigSchema.extend({
  _id: z.string(),
});

export type AdminConfigHistory = z.infer<typeof AdminConfigHistorySchema>;

export const CreateConfigInputSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.union([z.string(), z.number(), z.boolean()]),
  name: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateConfigInput = z.infer<typeof CreateConfigInputSchema>;

export const UpdateConfigInputSchema = z.object({
  value: z.union([z.string(), z.number(), z.boolean()]),
  name: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateConfigInput = z.infer<typeof UpdateConfigInputSchema>;

export const AdminSnapshotSchema = z.object({
  _id: z.string(),
  configs: z.record(z.union([z.string(), z.number(), z.boolean()])),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AdminSnapshot = z.infer<typeof AdminSnapshotSchema>;

export const CreateSnapshotInputSchema = z.object({
  name: z.string().optional(),
});

export type CreateSnapshotInput = z.infer<typeof CreateSnapshotInputSchema>;
