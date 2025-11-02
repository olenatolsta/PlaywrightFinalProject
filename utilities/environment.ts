import { z } from 'zod';

const environmentSchema = z.object({
  BASE_URL: z.url(),
  USER_NAME: z.string(),
  PASSWORD_CORRECT: z.string(),
  PASSWORD_INCORRECT: z.string(),
  EMAIL: z.string(),
});

const environment = environmentSchema.parse(process.env);

export default environment;
