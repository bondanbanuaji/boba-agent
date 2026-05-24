import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the root .env file relative to this file's position
// from: apps/api/src/config/env.ts -> ../../../../.env
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
