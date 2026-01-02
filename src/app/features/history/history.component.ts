import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatListModule],
  template: `
    <div class="history-container">
      <mat-card class="history-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="header-icon">history</mat-icon>
            Search History
          </mat-card-title>
          <mat-card-subtitle>
            Your previous symptom searches
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="history.length === 0" class="empty-state">
            <mat-icon class="empty-icon">history</mat-icon>
            <h3>No History Yet</h3>
            <p>Your symptom searches will appear here.</p>
            <button mat-raised-button color="primary" routerLink="/">
              <mat-icon>add</mat-icon>
              Start New Search
            </button>
          </div>

          <div *ngIf="history.length > 0" class="history-list">
            <mat-list>
              <mat-list-item *ngFor="let item of history; let i = index" class="history-item">
                <mat-icon matListItemIcon class="history-icon">search</mat-icon>
                <div matListItemTitle class="history-text">{{ item }}</div>
                <div matListItemLine class="history-date">{{ getFormattedDate(i) }}</div>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-card-content>

        <mat-card-actions *ngIf="history.length > 0" class="card-actions">
          <button mat-raised-button (click)="clearHistory()" color="warn" class="clear-button">
            <mat-icon>delete</mat-icon>
            <span>Clear History</span>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .history-container {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .history-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    mat-card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      margin: -16px -16px 24px -16px;
      border-radius: 16px 16px 0 0;
      box-shadow: none;
    }

    .header-icon {
      vertical-align: middle;
      margin-right: 8px;
    }

    mat-card-title {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0;
    }

    mat-card-subtitle {
      color: rgba(255, 255, 255, 0.9);
      margin-top: 8px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #999;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #333;
      margin-bottom: 12px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 24px;
    }

    .history-list {
      padding: 8px 0;
    }

    .history-item {
      border-bottom: 1px solid #eee;
      padding: 16px 0 !important;
      transition: background 0.2s ease;
    }

    .history-item:hover {
      background: #f8f9ff;
    }

    .history-item:last-child {
      border-bottom: none;
    }

    .history-icon {
      color: #667eea;
    }

    .history-text {
      font-weight: 500;
      color: #333;
      font-size: 1rem;
    }

    .history-date {
      color: #999;
      font-size: 0.85rem;
      margin-top: 4px;
    }

    .card-actions {
      padding: 20px 24px;
      background: #f8f9ff;
      margin: 24px -16px -16px -16px;
      display: flex;
      justify-content: center;
      border-radius: 0 0 16px 16px;
    }

    .clear-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px !important;
      border-radius: 25px;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
    }

    .clear-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
    }

    .clear-button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    @media (max-width: 768px) {
      mat-card-title {
        font-size: 1.4rem;
      }
    }
  `]
})
export class HistoryComponent implements OnInit {
  history: string[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.history = this.storage.getHistory();
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear all history?')) {
      this.storage.clearHistory();
      this.history = [];
    }
  }

  getFormattedDate(index: number): string {
    // Simple date formatting - in a real app, you'd store actual dates
    const now = new Date();
    const date = new Date(now.getTime() - (index * 24 * 60 * 60 * 1000));
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}

