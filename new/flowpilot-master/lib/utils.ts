import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple notification function to replace toast system
export const showNotification = (message: { 
  title: string; 
  description?: string; 
  variant?: 'default' | 'destructive' 
}) => {
  console.log(`${message.title}${message.description ? ': ' + message.description : ''}`);
}
