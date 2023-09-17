import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce(func: Function, delay: number) {
  let timerId: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function convertMsToMinutesAndSeconds(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Number(((ms % 60000) / 1000).toFixed(0));
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function countTo100InSeconds(seconds: number) {
  const countInterval = seconds * 1000 / 100; // Calculate interval in milliseconds

  let count = 0;

  function doCount() {
    count++;

    if (count <= 100) {
      setTimeout(doCount, countInterval);
    }
  }

  // Start the counting process
  doCount();

  return count
}

export function countTo100In(seconds: number, onUpdate: (count: number) => void) {
  let count = 0;
  const intervalMs = (seconds * 1000) / 100;

  const intervalId = setInterval(() => {
    count++;
    onUpdate(count);

    if (count === 100) {
      clearInterval(intervalId);
    }
  }, intervalMs);
}
