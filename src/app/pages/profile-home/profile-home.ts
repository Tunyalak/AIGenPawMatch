import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth';
import { MockDogService } from '../../services/mock-dog';
import { StorageService } from '../../services/storage';
import { ImageUploadComponent } from '../../components/image-upload/image-upload';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-profile-home',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    ImageUploadComponent
  ],
  templateUrl: './profile-home.html',
  styleUrl: './profile-home.scss',
})
export class ProfileHome implements OnInit {
  dogProfile = signal<any>(null);
  matches = signal<any[]>([]);
  stats = signal({
    totalSwipes: 0,
    matches: 0,
    favorites: 0
  });
  isEditingImage = signal(false);

  constructor(
    public authService: AuthService,
    private dogService: MockDogService,
    private storage: StorageService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.loadDogProfile();
    await this.loadMatches();
  }

  loadDogProfile() {
    const profile = this.storage.getItem('user_dog_profile');
    if (profile) {
      this.dogProfile.set(profile);
    }
  }

  async loadMatches() {
    const matches = await this.dogService.getMatches();
    this.matches.set(matches);

    // ดึงสถิติจาก service
    const stats = this.dogService.getStats();
    this.stats.set(stats);
  }

  editProfile() {
    this.router.navigate(['/register-dog']);
  }

  toggleImageEdit() {
    this.isEditingImage.set(!this.isEditingImage());
  }

  onImageSelected(dataUrl: string) {
    const profile = this.dogProfile();
    if (profile) {
      profile.imageUrl = dataUrl;
      profile.updatedAt = new Date();
      this.storage.setItem('user_dog_profile', profile);
      this.dogProfile.set(profile);
      this.isEditingImage.set(false);
    }
  }

  onImageRemoved() {
    const profile = this.dogProfile();
    if (profile) {
      profile.imageUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800';
      profile.updatedAt = new Date();
      this.storage.setItem('user_dog_profile', profile);
      this.dogProfile.set(profile);
    }
  }

  viewMatches() {
    alert('Matches feature - coming soon!');
  }

  async clearMatches() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Clear All Matches?',
        message: 'Are you sure you want to clear all matches? This action cannot be undone.',
        confirmText: 'Clear Matches',
        cancelText: 'Cancel',
        icon: 'delete',
        iconColor: '#F44336'
      }
    });

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        await this.dogService.clearMatches();
        await this.loadMatches();
      }
    });
  }

  async clearAllData() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Clear All Data?',
        message: 'Are you sure you want to clear all matches and swipe history? This will reset everything and cannot be undone.',
        confirmText: 'Clear All Data',
        cancelText: 'Cancel',
        icon: 'warning',
        iconColor: '#FF8A00'
      }
    });

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        await this.dogService.clearAll();
        await this.loadMatches();
      }
    });
  }

  signOut() {
    this.authService.signOut();
  }

  goToMatchPreferences() {
    this.router.navigate(['/match-preferences']);
  }

  goBack() {
    this.router.navigate(['/match']);
  }
}
