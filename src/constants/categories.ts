import { NoteCategory } from "@/types/Note";

export interface CategoryInfo {
  name: NoteCategory;
  icon: string;
  color: string;
  backgroundColor: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: "Work",
    icon: "briefcase-outline",
    color: "#2563EB",
    backgroundColor: "#DBEAFE",
  },
  {
    name: "Study",
    icon: "book-outline",
    color: "#7C3AED",
    backgroundColor: "#EDE9FE",
  },
  {
    name: "Personal",
    icon: "person-outline",
    color: "#059669",
    backgroundColor: "#D1FAE5",
  },
  {
    name: "Ideas",
    icon: "bulb-outline",
    color: "#D97706",
    backgroundColor: "#FEF3C7",
  },
];