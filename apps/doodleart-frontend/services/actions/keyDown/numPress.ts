import { Tool } from "@/services/types";

export const toolKeyMap: Record<string, Tool> = {
  "1": "cursor",
  "2": "rect",
  "3": "diamond",
  "4": "elip",
  "5": "line",
  "6": "pencil",
  "7": "text",
};

export function handleToolShortcut(key: string) {
  const tool = toolKeyMap[key];
  if (!tool) return null;
  return tool;
}
