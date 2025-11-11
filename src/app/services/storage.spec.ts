import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage';

describe('StorageService', () => {
  let service: StorageService;
  const TEST_KEY = 'test_key';
  const TEST_VALUE = { name: 'Test', value: 123 };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem and getItem', () => {
    it('should store and retrieve item', () => {
      service.setItem(TEST_KEY, TEST_VALUE);
      const result = service.getItem<typeof TEST_VALUE>(TEST_KEY);

      expect(result).toEqual(TEST_VALUE);
    });

    it('should return null for non-existent item', () => {
      const result = service.getItem('non_existent');

      expect(result).toBeNull();
    });

    it('should handle complex objects', () => {
      const complexObj = {
        id: 1,
        nested: { value: 'test' },
        array: [1, 2, 3]
      };

      service.setItem(TEST_KEY, complexObj);
      const result = service.getItem<typeof complexObj>(TEST_KEY);

      expect(result).toEqual(complexObj);
    });
  });

  describe('removeItem', () => {
    it('should remove item from storage', () => {
      service.setItem(TEST_KEY, TEST_VALUE);
      service.removeItem(TEST_KEY);
      const result = service.getItem(TEST_KEY);

      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all items with prefix', () => {
      service.setItem('key1', 'value1');
      service.setItem('key2', 'value2');
      service.clear();

      expect(service.getItem('key1')).toBeNull();
      expect(service.getItem('key2')).toBeNull();
    });
  });

  describe('createPersistedSignal', () => {
    it('should create signal with initial value', () => {
      const signal = service.createPersistedSignal(TEST_KEY, 'initial');

      expect(signal()).toBe('initial');
    });

    it('should persist value when set', () => {
      const signal = service.createPersistedSignal(TEST_KEY, 'initial');
      signal.set('updated');

      const stored = service.getItem<string>(TEST_KEY);
      expect(stored).toBe('updated');
      expect(signal()).toBe('updated');
    });

    it('should load persisted value on creation', () => {
      service.setItem(TEST_KEY, 'persisted');
      const signal = service.createPersistedSignal(TEST_KEY, 'initial');

      expect(signal()).toBe('persisted');
    });
  });
});
