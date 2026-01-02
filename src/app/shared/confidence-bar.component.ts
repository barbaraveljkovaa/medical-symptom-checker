import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-confidence-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <div class="confidence-bar-container">
      <div class="confidence-header">
        <span class="confidence-label" *ngIf="label">{{ label }}</span>
        <div class="confidence-badge" [style.background]="getProbabilityColor(value)">
          {{ getPercentage() }}%
        </div>
      </div>
      <mat-progress-bar 
        mode="determinate" 
        [value]="value"
        [color]="getProgressBarColor()"
        class="confidence-progress">
      </mat-progress-bar>
    </div>
  `,
  styles: [`
    .confidence-bar-container {
      width: 100%;
      padding: 4px 0;
    }

    .confidence-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .confidence-label {
      font-weight: 500;
      color: #333;
      font-size: 0.95rem;
      flex: 1;
      min-width: 0;
      word-wrap: break-word;
    }

    .confidence-badge {
      color: white;
      padding: 10px 18px;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 700;
      min-width: 65px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .confidence-badge:hover {
      transform: scale(1.05);
    }

    .confidence-progress {
      height: 10px;
      border-radius: 5px;
      overflow: hidden;
    }

    /* Tablet and below */
    @media (max-width: 768px) {
      .confidence-bar-container {
        padding: 6px 0;
      }

      .confidence-header {
        flex-direction: row;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }

      .confidence-label {
        font-size: 0.9rem;
        flex: 1 1 auto;
      }

      .confidence-badge {
        padding: 8px 16px;
        font-size: 0.95rem;
        min-width: 60px;
      }

      .confidence-progress {
        height: 9px;
      }
    }

    /* Mobile phones */
    @media (max-width: 480px) {
      .confidence-bar-container {
        padding: 8px 0;
      }

      .confidence-header {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        margin-bottom: 10px;
      }

      .confidence-label {
        font-size: 0.85rem;
        text-align: left;
        margin-bottom: 4px;
      }

      .confidence-badge {
        align-self: flex-end;
        padding: 10px 20px;
        font-size: 1rem;
        min-width: 70px;
        width: fit-content;
      }

      .confidence-progress {
        height: 8px;
      }
    }

    /* Very small screens */
    @media (max-width: 360px) {
      .confidence-badge {
        padding: 8px 16px;
        font-size: 0.9rem;
        min-width: 60px;
      }

      .confidence-label {
        font-size: 0.8rem;
      }
    }
  `]
})
export class ConfidenceBarComponent {
  @Input() value: number = 0; // Value between 0 and 100
  @Input() label?: string; // Optional label to display

  getPercentage(): string {
    return this.value.toFixed(0);
  }

  getProbabilityColor(value: number): string {
    if (value >= 70) return 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
    if (value >= 40) return 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }

  getProgressBarColor(): string {
    if (this.value >= 70) return 'primary';
    if (this.value >= 40) return 'accent';
    return 'primary';
  }
}

