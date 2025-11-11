import { Component, OnInit, signal, computed, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule, MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Dog, DogFilters, DEFAULT_FILTERS } from '../../models/dog.model';
import { MockDogService } from '../../services/mock-dog';
import { SwipeEngineService, SwipeState } from '../../services/swipe-engine';
import { StorageService } from '../../services/storage';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-match-swipe',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatBadgeModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './match-swipe.html',
  styleUrl: './match-swipe.scss',
})
export class MatchSwipe implements OnInit, OnDestroy {
  dogs = signal<Dog[]>([]);
  currentDog = computed(() => this.dogs()[0] || null);
  filters = signal<DogFilters>(DEFAULT_FILTERS);
  matchCount = signal(0);
  isLoading = signal(false);

  private routerSubscription?: Subscription;

  // Swipe state
  swipeState = signal<SwipeState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    rotation: 0,
    opacity: 1,
    direction: 'none'
  });

  constructor(
    private dogService: MockDogService,
    private swipeEngine: SwipeEngineService,
    private storage: StorageService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.loadDogs();
    await this.loadMatchCount();
    this.loadFilters();

    // Subscribe to router events เพื่อ reload เมื่อกลับมาจากหน้า preferences
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/match') {
          this.loadFilters();
          this.loadDogs();
        }
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  async loadDogs() {
    this.isLoading.set(true);
    try {
      console.log('Loading dogs with filters:', this.filters());
      const dogs = await this.dogService.getDogs(this.filters());
      console.log('Dogs loaded:', dogs.length, 'dogs');
      this.dogs.set(dogs);
    } catch (error) {
      console.error('Error loading dogs:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMatchCount() {
    const matches = await this.dogService.getMatches();
    this.matchCount.set(matches.length);
  }

  loadFilters() {
    const saved = this.storage.getItem<DogFilters>('dog_filters');
    console.log('Loading filters from storage:', saved);
    if (saved) {
      this.filters.set(saved);
      console.log('Filters set to:', this.filters());
    }
  }

  // Touch events for mobile
  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.startDrag(touch.clientX, touch.clientY);
  }

  onTouchMove(event: TouchEvent) {
    if (this.swipeState().isDragging) {
      event.preventDefault();
      const touch = event.touches[0];
      this.updateDrag(touch.clientX, touch.clientY);
    }
  }

  onTouchEnd() {
    this.endDrag();
  }

  // Mouse events for desktop
  onMouseDown(event: MouseEvent) {
    this.startDrag(event.clientX, event.clientY);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.swipeState().isDragging) {
      this.updateDrag(event.clientX, event.clientY);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.swipeState().isDragging) {
      this.endDrag();
    }
  }

  // Keyboard events
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.currentDog()) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.pass();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.like();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.favorite();
        break;
      case 'z':
      case 'Z':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.undo();
        }
        break;
    }
  }

  // Mouse wheel events
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (!this.currentDog()) return;

    // Prevent default scrolling
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();

      // Horizontal scroll
      if (event.deltaX > 20) {
        this.like();
      } else if (event.deltaX < -20) {
        this.pass();
      }
    } else if (event.deltaY !== 0) {
      // Vertical scroll
      if (event.deltaY < -20) {
        event.preventDefault();
        this.favorite();
      }
    }
  }

  private startDrag(x: number, y: number) {
    const state = this.swipeEngine.calculateSwipeState(x, y, x, y, true);
    this.swipeState.set(state);
  }

  private updateDrag(x: number, y: number) {
    const current = this.swipeState();
    const state = this.swipeEngine.calculateSwipeState(
      current.startX,
      current.startY,
      x,
      y,
      true
    );
    this.swipeState.set(state);
  }

  private async endDrag() {
    const current = this.swipeState();
    const result = this.swipeEngine.shouldTriggerSwipe(current);

    if (result.triggered && result.action) {
      await this.handleSwipe(result.action);
    } else {
      // Snap back
      this.swipeState.set({
        ...current,
        isDragging: false,
        deltaX: 0,
        deltaY: 0,
        rotation: 0,
        opacity: 1,
        direction: 'none'
      });
    }
  }

  async handleSwipe(action: 'pass' | 'like' | 'favorite') {
    const dog = this.currentDog();
    if (!dog) return;

    // Animate out
    const current = this.swipeState();
    const exitX = action === 'pass' ? -1000 : action === 'like' ? 1000 : 0;
    const exitY = action === 'favorite' ? -1000 : 0;

    this.swipeState.set({
      ...current,
      currentX: exitX,
      currentY: exitY,
      opacity: 0
    });

    // Submit swipe
    setTimeout(async () => {
      const result = await this.dogService.submitSwipe(dog.id, action);

      if (result.isMatch) {
        this.matchCount.set(this.matchCount() + 1);
        this.showMatchDialog(result.match!);
      }

      // Remove card
      this.dogs.set(this.dogs().slice(1));

      // Reset state
      this.swipeState.set({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        deltaX: 0,
        deltaY: 0,
        rotation: 0,
        opacity: 1,
        direction: 'none'
      });

      // Load more dogs if running low
      if (this.dogs().length < 3) {
        await this.loadDogs();
      }
    }, 300);
  }

  // Button actions
  pass() {
    this.handleSwipe('pass');
  }

  like() {
    this.handleSwipe('like');
  }

  favorite() {
    this.handleSwipe('favorite');
  }

  async undo() {
    const dog = await this.dogService.undoLastSwipe();
    if (dog) {
      this.dogs.set([dog, ...this.dogs()]);
    }
  }

  showMatchDialog(match: any) {
    this.snackBar.open(
      `🎉 It's a match! You matched with ${match.dog.name}!`,
      'View Profile',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['match-snackbar']
      }
    );
  }

  openFilters() {
    this.router.navigate(['/match-preferences']);
  }

  async openNotifications() {
    const matches = await this.dogService.getMatches();
    const { NotificationsPanel } = await import('../../components/notifications-panel/notifications-panel');

    this.bottomSheet.open(NotificationsPanel, {
      data: { matches },
      panelClass: 'notifications-bottom-sheet'
    });
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }

  getCardTransform(): string {
    return this.swipeEngine.getCardTransform(this.swipeState());
  }

  getOverlayLabel() {
    return this.swipeEngine.getOverlayLabel(this.swipeState().direction);
  }
}
