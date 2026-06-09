import { publicApi } from "./client";
import type { Agency } from "../types";

export async function getAgencies() {
  const { data } = await publicApi.get("/agencies");
  return data as { message: string; data: Agency[] };
}
