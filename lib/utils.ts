import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert from CLOSED_BODY to Closed Body
// keep only first letter of each word in uppercase
export function convertToTitleCase(str: string) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// limit the string to the given length
export function limitString(str: string, length: number) {
  return str.slice(0, length);
}
