import { publicApi } from "./client";
import type { Category } from "../types";

export async function getCategories() {
  const { data } = await publicApi.get("/categories");
  return data as { message: string; data: Category[] };
}
