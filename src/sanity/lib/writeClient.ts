import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("❌ SANITY_API_WRITE_TOKEN is missing!");
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});