// import { createClient } from "next-sanity";
// import { apiVersion, dataset, projectId } from "../env";

// const token = process.env.SANITY_API_WRITE_TOKEN;

// if (!token) {
//   console.error("❌ SANITY_API_WRITE_TOKEN is missing!");
// }

// export const writeClient = createClient({
//   projectId,
//   dataset,
//   apiVersion,
//   useCdn: false,
//   token,
// });



import { createClient } from 'next-sanity';

export const writeClient = createClient({
  projectId: "iyggf3hg", // Aapne console mein yahi ID use ki hai, ye sahi hai
  dataset: "production",
  apiVersion: "2026-05-21",
  useCdn: false, // Mutation (write) ke liye false zaruri hai
  token: process.env.SANITY_API_TOKEN,
});