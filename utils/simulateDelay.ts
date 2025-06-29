export function simulateDelay(duration: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
