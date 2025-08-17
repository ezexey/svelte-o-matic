// Add a helper function to create a timeout promise
export const withTimeout = <T>(promise: Promise<T>, timeout = 1000, error = new Error("timed out")) => {
  return Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(error), timeout))]);
};

// Add a helper function to invokable task.delay
export async function delay<T>(ms: number, then: () => T = () => ({} as T)) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return then();
}
