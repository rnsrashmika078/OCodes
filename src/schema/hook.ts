import z from "zod";

export const promptAreaSchema = z.object({
  prompt: z.string().nullish(),
});

export type promptAreaSchemaType = z.infer<typeof promptAreaSchema>;
