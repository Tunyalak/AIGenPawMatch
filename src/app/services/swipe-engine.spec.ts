import { TestBed } from '@angular/core/testing';
import { SwipeEngineService } from './swipe-engine';

describe('SwipeEngineService', () => {
  let service: SwipeEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwipeEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateSwipeState', () => {
    it('should calculate correct deltas', () => {
      const state = service.calculateSwipeState(100, 100, 200, 150, true);

      expect(state.deltaX).toBe(100);
      expect(state.deltaY).toBe(50);
      expect(state.isDragging).toBe(true);
    });

    it('should calculate rotation based on horizontal movement', () => {
      const state = service.calculateSwipeState(100, 100, 200, 100, true);

      expect(state.rotation).toBeGreaterThan(0);
    });

    it('should determine left direction for negative deltaX', () => {
      const state = service.calculateSwipeState(200, 100, 100, 100, true);

      expect(state.direction).toBe('left');
    });

    it('should determine right direction for positive deltaX', () => {
      const state = service.calculateSwipeState(100, 100, 200, 100, true);

      expect(state.direction).toBe('right');
    });

    it('should determine up direction for negative deltaY', () => {
      const state = service.calculateSwipeState(100, 200, 100, 50, true);

      expect(state.direction).toBe('up');
    });
  });

  describe('shouldTriggerSwipe', () => {
    it('should not trigger swipe below threshold', () => {
      const state = service.calculateSwipeState(100, 100, 110, 100, false);
      const result = service.shouldTriggerSwipe(state);

      expect(result.triggered).toBe(false);
      expect(result.action).toBe(null);
    });

    it('should trigger pass action for left swipe above threshold', () => {
      const state = service.calculateSwipeState(200, 100, 50, 100, false);
      const result = service.shouldTriggerSwipe(state);

      expect(result.triggered).toBe(true);
      expect(result.action).toBe('pass');
    });

    it('should trigger like action for right swipe above threshold', () => {
      const state = service.calculateSwipeState(100, 100, 250, 100, false);
      const result = service.shouldTriggerSwipe(state);

      expect(result.triggered).toBe(true);
      expect(result.action).toBe('like');
    });

    it('should trigger favorite action for upward swipe above threshold', () => {
      const state = service.calculateSwipeState(100, 200, 100, 50, false);
      const result = service.shouldTriggerSwipe(state);

      expect(result.triggered).toBe(true);
      expect(result.action).toBe('favorite');
    });
  });

  describe('getCardTransform', () => {
    it('should return identity transform for zero deltas', () => {
      const state = service.calculateSwipeState(0, 0, 0, 0, false);
      const transform = service.getCardTransform(state);

      expect(transform).toBe('translate(0, 0) rotate(0deg)');
    });

    it('should return correct transform with deltas', () => {
      const state = service.calculateSwipeState(100, 100, 150, 120, true);
      const transform = service.getCardTransform(state);

      expect(transform).toContain('translate(50px, 20px)');
      expect(transform).toContain('rotate(');
    });
  });

  describe('getOverlayLabel', () => {
    it('should return pass label for left direction', () => {
      const label = service.getOverlayLabel('left');

      expect(label).not.toBeNull();
      expect(label?.text).toBe('PASS');
      expect(label?.class).toBe('pass');
    });

    it('should return like label for right direction', () => {
      const label = service.getOverlayLabel('right');

      expect(label).not.toBeNull();
      expect(label?.text).toBe('LIKE');
      expect(label?.class).toBe('like');
    });

    it('should return favorite label for up direction', () => {
      const label = service.getOverlayLabel('up');

      expect(label).not.toBeNull();
      expect(label?.text).toBe('FAVORITE');
      expect(label?.class).toBe('favorite');
    });

    it('should return null for none direction', () => {
      const label = service.getOverlayLabel('none');

      expect(label).toBeNull();
    });
  });

  describe('configuration', () => {
    it('should return current config', () => {
      const config = service.getConfig();

      expect(config.threshold).toBeDefined();
      expect(config.rotationFactor).toBeDefined();
      expect(config.snapBackDuration).toBeDefined();
    });

    it('should update config', () => {
      service.updateConfig({ threshold: 150 });
      const config = service.getConfig();

      expect(config.threshold).toBe(150);
    });
  });
});
