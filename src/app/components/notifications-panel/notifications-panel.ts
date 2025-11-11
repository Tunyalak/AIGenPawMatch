import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './notifications-panel.html',
  styleUrl: './notifications-panel.scss'
})
export class NotificationsPanel {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { matches: any[] },
    private bottomSheetRef: MatBottomSheetRef<NotificationsPanel>
  ) {}

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  viewMatch(match: any): void {
    this.bottomSheetRef.dismiss(match);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const matchDate = new Date(date);
    const diffMs = now.getTime() - matchDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return matchDate.toLocaleDateString();
  }
}
