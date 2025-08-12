export type StateListener<T> = (newValue: T, oldValue: T) => void;
export type StateUnsubscribe = () => void;

export class StateManager {
  private state: Map<string, any> = new Map();
  private listeners: Map<string, Set<StateListener<any>>> = new Map();

  get<T>(key: string): T | undefined {
    return this.state.get(key);
  }

  set<T>(key: string, value: T): void {
    const oldValue = this.state.get(key);
    this.state.set(key, value);
    this.notifyListeners(key, value, oldValue);
  }

  update<T>(key: string, updater: (prev: T | undefined) => T): void {
    const oldValue = this.state.get(key);
    const newValue = updater(oldValue);
    this.set(key, newValue);
  }

  delete(key: string): boolean {
    const oldValue = this.state.get(key);
    const result = this.state.delete(key);
    if (result) {
      this.notifyListeners(key, undefined, oldValue);
    }
    return result;
  }

  subscribe<T>(key: string, listener: StateListener<T>): StateUnsubscribe {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);

    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(listener);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  private notifyListeners(key: string, newValue: any, oldValue: any): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(listener => {
        try {
          listener(newValue, oldValue);
        } catch (error) {
          console.error(`Error in state listener for ${key}:`, error);
        }
      });
    }
  }

  clear(): void {
    this.state.clear();
    this.listeners.clear();
  }

  toObject(): Record<string, any> {
    return Object.fromEntries(this.state);
  }
}
