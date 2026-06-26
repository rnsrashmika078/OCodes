import z from "zod";

export const promptAreaSchema = z.object({
  prompt: z.string(),
});

export type promptAreaSchemaType = z.infer<typeof promptAreaSchema>;
