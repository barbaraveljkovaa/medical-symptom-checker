import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SymptomService, Symptom } from '../../core/services/symptom.service';
import { StorageService } from '../../core/services/storage.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-symptom-selector',
  standalone: false,
  template: `
    <div class="symptom-selector-container">
      <mat-card class="main-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="header-icon">sick</mat-icon>
            Select Your Symptoms
          </mat-card-title>
          <mat-card-subtitle>
            Click symptoms to add them, then drag to prioritize (most severe at top)
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Selected Symptoms (Priority List) -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>priority_high</mat-icon>
              Selected Symptoms ({{ selectedSymptoms.length }})
            </h3>
            <div
              cdkDropList
              (cdkDropListDropped)="drop($event)"
              class="priority-list"
              [class.empty]="selectedSymptoms.length === 0"
            >
              <div
                *ngIf="selectedSymptoms.length === 0"
                class="empty-state"
              >
                <mat-icon>drag_indicator</mat-icon>
                <p>No symptoms selected yet. Click symptoms below to add them.</p>
              </div>
              <div
                class="priority-item"
                *ngFor="let s of selectedSymptoms; let i = index"
                cdkDrag
              >
                <div class="item-content">
                  <span class="priority-number">{{ i + 1 }}</span>
                  <span class="item-name">{{ s.name }}</span>
                  <button 
                    mat-icon-button 
                    (click)="remove(s)"
                    class="remove-btn"
                    aria-label="Remove symptom">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
                <div *cdkDragPreview class="drag-preview">{{ s.name }}</div>
              </div>
            </div>
          </div>

          <!-- Available Symptoms -->
          <div class="section">
            <h3 class="section-title">
              <mat-icon>list</mat-icon>
              Available Symptoms
            </h3>
            
            <div *ngIf="loading" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Loading symptoms...</p>
            </div>

            <div *ngIf="error" class="error-message">
              <mat-icon>warning</mat-icon>
              <span>{{ error }}</span>
            </div>

            <div *ngIf="!loading && symptoms.length === 0" class="empty-symptoms">
              <mat-icon>info</mat-icon>
              <p>No symptoms available. Please check your connection.</p>
            </div>

            <div *ngIf="!loading && symptoms.length > 0" class="symptoms-grid">
              <button
                *ngFor="let s of symptoms"
                mat-raised-button
                [class.selected]="isSelected(s)"
                (click)="toggle(s)"
                class="symptom-chip"
              >
                <mat-icon>{{ isSelected(s) ? 'check_circle' : 'add_circle_outline' }}</mat-icon>
                {{ s.name }}
              </button>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions class="card-actions">
          <button 
            mat-raised-button 
            color="primary" 
            (click)="go()"
            [disabled]="selectedSymptoms.length === 0"
            class="submit-button">
            <mat-icon>assessment</mat-icon>
            <span>Get Results</span>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .symptom-selector-container {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .main-card {
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

    .section {
      margin-bottom: 32px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .section-title mat-icon {
      color: #667eea;
    }

    .priority-list {
      border: 2px dashed #667eea;
      border-radius: 12px;
      padding: 16px;
      min-height: 120px;
      background: #f8f9ff;
      transition: all 0.3s ease;
    }

    .priority-list.empty {
      border-color: #ddd;
      background: #fafafa;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .priority-item {
      margin-bottom: 12px;
      cursor: move;
    }

    .priority-item:last-child {
      margin-bottom: 0;
    }

    .item-content {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 14px 16px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .priority-item:hover .item-content {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .priority-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .item-name {
      flex: 1;
      font-weight: 500;
      font-size: 1rem;
    }

    .remove-btn {
      color: #f44336;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      gap: 16px;
    }

    .loading-container p {
      color: #666;
      margin: 0;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
      margin-bottom: 16px;
      color: #856404;
    }

    .error-message mat-icon {
      color: #ff9800;
    }

    .empty-symptoms {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }

    .empty-symptoms mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .symptoms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }

    .symptom-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px !important;
      border-radius: 25px;
      transition: all 0.3s ease;
      text-transform: none;
      font-weight: 500;
    }

    .symptom-chip:not(.selected) {
      background: #f5f5f5;
      color: #666;
    }

    .symptom-chip:hover:not(.selected) {
      background: #e8e8e8;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .symptom-chip.selected {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .symptom-chip mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .card-actions {
      padding: 20px 24px;
      display: flex;
      justify-content: center;
      background: #f8f9ff;
      margin: 24px -16px -16px -16px;
    }

    .submit-button {
      padding: 12px 32px !important;
      font-size: 1.1rem;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .drag-preview {
      background: white;
      padding: 14px 16px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .symptoms-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
      }

      mat-card-title {
        font-size: 1.4rem;
      }
    }
  `]
})
export class SymptomSelectorComponent implements OnInit, OnDestroy {

  // Initialize with fallback symptoms immediately so they're always visible
  symptoms: Symptom[] = [
    { id: 1, name: 'Fever' },
    { id: 2, name: 'Cough' },
    { id: 3, name: 'Headache' },
    { id: 4, name: 'Fatigue' }
  ];
  selectedSymptoms: Symptom[] = [];
  loading = false; // Start as false since we have fallback data
  error: string | null = null;
  private subscription?: Subscription;

  constructor(
    private service: SymptomService,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnInit() {
    // Reset selected symptoms on init
    this.selectedSymptoms = [];
    this.error = null;
    
    // Load symptoms from API (will replace fallback if successful)
    // Don't set loading to true since we already have fallback data visible
    this.loadSymptoms();
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadSymptoms() {
    // Only show loading if we don't have symptoms yet
    if (this.symptoms.length === 0) {
      this.loading = true;
    }
    this.error = null;
    
    // Unsubscribe from previous subscription if exists
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    this.subscription = this.service.getSymptoms().subscribe({
      next: (data) => {
        // Apply any emission (fallback first, then API result)
        if (data && Array.isArray(data)) {
          this.symptoms = data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading symptoms:', err);
        this.loading = false;
        this.error = 'Unable to load symptoms from server. Using default symptoms.';
      }
    });
  }

  isSelected(symptom: Symptom): boolean {
    return this.selectedSymptoms.some(s => s.id === symptom.id);
  }

  toggle(symptom: Symptom) {
    const index = this.selectedSymptoms.findIndex(s => s.id === symptom.id);
    if (index >= 0) {
      this.selectedSymptoms.splice(index, 1);
    } else {
      this.selectedSymptoms.push(symptom);
    }
  }

  remove(symptom: Symptom) {
    const index = this.selectedSymptoms.findIndex(s => s.id === symptom.id);
    if (index >= 0) {
      this.selectedSymptoms.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<Symptom[]>) {
    moveItemInArray(
      this.selectedSymptoms,
      event.previousIndex,
      event.currentIndex
    );
  }

  go() {
    if (this.selectedSymptoms.length > 0) {
      const symptomIds = this.selectedSymptoms.map(s => s.id);
      
      // Store in localStorage as backup
      try {
        localStorage.setItem('selectedSymptoms', JSON.stringify(symptomIds));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
      
      // Add a human-readable entry to history (names joined)
      try {
        const names = this.selectedSymptoms.map(s => s.name).join(', ');
        this.storage.addToHistory(names);
      } catch (e) {
        console.warn('Could not add to history:', e);
      }

      this.router.navigate(['/results'], {
        state: {
          symptoms: symptomIds
        }
      });
    }
  }
}
