import { z } from "zod";

const environmentSchema = z.object({
  BASE_URL: z.url(),
  USER_1_EMAIL: z.string(),
  USER_1_PASSWORD: z.string(),
  USER_2_EMAIL: z.string(),
  USER_2_PASSWORD: z.string(),
  PARENT_SECTION: z.string(),
  CHILD_SECTION: z.string(),
});

//Verifies environment mapping correctness
const environment = environmentSchema.parse(process.env);

export default environment;
