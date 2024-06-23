import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function indexToOrdinalString(index: number): string {
  const suffixes = ["st", "nd", "rd"];
  const ordinal = index + 1;

  if (ordinal % 10 === 1 && ordinal !== 11) {
    return `${ordinal}st`;
  } else if (ordinal % 10 === 2 && ordinal !== 12) {
    return `${ordinal}nd`;
  } else if (ordinal % 10 === 3 && ordinal !== 13) {
    return `${ordinal}rd`;
  } else {
    return `${ordinal}th`;
  }
}
