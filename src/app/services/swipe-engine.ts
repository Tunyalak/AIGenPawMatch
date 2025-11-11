import { Injectable } from '@angular/core';

export interface SwipeConfig {
  threshold: number; // Distance threshold for swipe detection
  rotationFactor: number; // How much rotation during drag
  snapBackDuration: number; // Animation duration for snap back
}

export interface SwipeState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  rotation: number;
  opacity: number;
  direction: 'none' | 'left' | 'right' | 'up';
}

@Injectable({
  providedIn: 'root',
})
export class SwipeEngineService {
  private config: SwipeConfig = {
    threshold: 100,
    rotationFactor: 20,
    snapBackDuration: 200
  };

  /**
   * Calculate swipe state from drag movement
   */
  calculateSwipeState(
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
    isDragging: boolean
  ): SwipeState {
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Calculate rotation based on horizontal movement
    const rotation = (deltaX / window.innerWidth) * this.config.rotationFactor;

    // Calculate opacity based on distance
    const opacity = Math.max(0.5, 1 - distance / (this.config.threshold * 3));

    // Determine direction
    let direction: 'none' | 'left' | 'right' | 'up' = 'none';

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > this.config.threshold / 2) {
        direction = deltaX > 0 ? 'right' : 'left';
      }
    } else {
      // Vertical swipe
      if (deltaY < -this.config.threshold / 2) {
        direction = 'up';
      }
    }

    return {
      isDragging,
      startX,
      startY,
      currentX,
      currentY,
      deltaX,
      deltaY,
      rotation,
      opacity,
      direction
    };
  }

  /**
   * Determine if swipe should be triggered
   */
  shouldTriggerSwipe(state: SwipeState): { triggered: boolean; action: 'pass' | 'like' | 'favorite' | null } {
    const distance = Math.sqrt(state.deltaX * state.deltaX + state.deltaY * state.deltaY);

    if (distance < this.config.threshold) {
      return { triggered: false, action: null };
    }

    // Determine action based on direction
    if (Math.abs(state.deltaX) > Math.abs(state.deltaY)) {
      // Horizontal swipe
      if (state.deltaX < -this.config.threshold) {
        return { triggered: true, action: 'pass' };
      } else if (state.deltaX > this.config.threshold) {
        return { triggered: true, action: 'like' };
      }
    } else {
      // Vertical swipe
      if (state.deltaY < -this.config.threshold) {
        return { triggered: true, action: 'favorite' };
      }
    }

    return { triggered: false, action: null };
  }

  /**
   * Get transform CSS for card based on swipe state
   */
  getCardTransform(state: SwipeState): string {
    if (!state.isDragging && state.deltaX === 0 && state.deltaY === 0) {
      return 'translate(0, 0) rotate(0deg)';
    }

    return `translate(${state.deltaX}px, ${state.deltaY}px) rotate(${state.rotation}deg)`;
  }

  /**
   * Get overlay label based on direction
   */
  getOverlayLabel(direction: SwipeState['direction']): { text: string; class: string } | null {
    switch (direction) {
      case 'left':
        return { text: 'PASS', class: 'pass' };
      case 'right':
        return { text: 'LIKE', class: 'like' };
      case 'up':
        return { text: 'FAVORITE', class: 'favorite' };
      default:
        return null;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SwipeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): SwipeConfig {
    return { ...this.config };
  }
}
