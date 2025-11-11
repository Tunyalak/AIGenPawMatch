import { Injectable, signal, Signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly PREFIX = 'pawmatch_';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Get an item from localStorage
   */
  getItem<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Set an item in localStorage
   */
  setItem<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  /**
   * Remove an item from localStorage
   */
  removeItem(key: string): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clear all items from localStorage with our prefix
   */
  clear(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(this.PREFIX)
      );
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Create a signal backed by localStorage
   */
  createPersistedSignal<T>(key: string, initialValue: T): Signal<T> & { set: (value: T) => void } {
    const stored = this.getItem<T>(key);
    const sig = signal<T>(stored ?? initialValue);

    const originalSet = sig.set.bind(sig);
    const wrappedSet = (value: T) => {
      originalSet(value);
      this.setItem(key, value);
    };

    return Object.assign(sig, { set: wrappedSet });
  }
}
