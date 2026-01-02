import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConditionService, ConditionResult } from '../../core/services/condition.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-results',
  standalone: false,
  template: `
    <div class="results-container">
      <mat-card class="results-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="header-icon">assessment</mat-icon>
            Diagnosis Results
          </mat-card-title>
          <mat-card-subtitle>
            Based on your selected symptoms
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Analyzing symptoms...</p>
          </div>

          <div *ngIf="error" class="error-message">
            <mat-icon>error</mat-icon>
            <div class="error-content">
              <h3>{{ error }}</h3>
              <button mat-raised-button color="primary" routerLink="/">
                <mat-icon>arrow_back</mat-icon>
                Select Symptoms
              </button>
            </div>
          </div>

          <div *ngIf="!loading && !error && results.length === 0" class="no-results">
            <mat-icon class="empty-icon">info</mat-icon>
            <h3>No Results Available</h3>
            <p>Please select symptoms first to get diagnosis results.</p>
            <button mat-raised-button color="primary" routerLink="/">
              <mat-icon>arrow_back</mat-icon>
              Select Symptoms
            </button>
          </div>

          <div *ngIf="!loading && !error && results.length > 0" class="results-content">
            <div class="results-grid">
              <mat-card 
                *ngFor="let result of results; let i = index" 
                class="condition-card"
                [class.top-result]="i === 0 && result.probability > 0.5">
                <mat-card-content>
                  <div class="condition-header">
                    <div class="condition-info">
                      <h3 class="condition-name">{{ result.name }}</h3>
                      <p class="condition-description">{{ result.description }}</p>
                    </div>
                  </div>
                  <app-confidence-bar 
                    [value]="result.probability * 100">
                  </app-confidence-bar>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="disclaimer">
              <mat-icon>warning</mat-icon>
              <p>
                <strong>Disclaimer:</strong> This is a demonstration tool and should not be used for actual medical diagnosis. 
                Please consult with a healthcare professional for accurate medical advice.
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .results-container {
      animation: fadeIn 0.5s ease-in;
      min-height: calc(100vh - 64px);
      width: 100%;
      padding: 40px 24px;
      box-sizing: border-box;
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    @media (max-width: 768px) {
      .results-container {
        padding: 24px 16px;
      }
    }

    @media (max-width: 480px) {
      .results-container {
        padding: 20px 12px;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .results-card {
      background: transparent;
      border-radius: 16px;
      box-shadow: none;
      padding: 24px;
      margin: 0 auto;
      max-width: 1100px;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .results-card {
        padding: 20px;
      }
    }

    @media (max-width: 480px) {
      .results-card {
        padding: 16px;
        border-radius: 12px;
      }
    }

    mat-card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      margin: -16px -16px 24px -16px;
      box-shadow: none;
      border-radius: 16px 16px 0 0;
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      gap: 20px;
    }

    .loading-container p {
      color: #666;
      font-size: 1.1rem;
    }

    .error-message {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 24px;
      background: #ffebee;
      border-radius: 8px;
      border-left: 4px solid #f44336;
      margin-bottom: 20px;
    }

    .error-message mat-icon {
      color: #f44336;
      font-size: 32px;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }

    .error-content {
      flex: 1;
    }

    .error-content h3 {
      color: #c62828;
      margin: 0 0 16px 0;
      font-size: 1.1rem;
    }

    .no-results {
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

    .no-results h3 {
      color: #333;
      margin-bottom: 12px;
    }

    .no-results p {
      color: #666;
      margin-bottom: 24px;
    }

    .results-content {
      padding: 8px 0;
    }

    .results-grid {
      display: grid;
      gap: 20px;
      margin-bottom: 32px;
    }

    .condition-card {
      border-radius: 12px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      background: white;
      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
      padding: 12px;
    }

    .condition-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .condition-card.top-result {
      border-color: #4caf50;
      background: linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%);
    }

    .condition-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      gap: 16px;
    }

    .condition-info {
      flex: 1;
      min-width: 0;
    }

    .condition-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
      word-wrap: break-word;
      line-height: 1.3;
    }

    .condition-description {
      color: #666;
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      word-wrap: break-word;
    }


    .disclaimer {
      display: flex;
      gap: 12px;
      padding: 20px;
      background: #fff3cd;
      border-radius: 8px;
      border-left: 4px solid #ffc107;
      margin-top: 24px;
    }

    .disclaimer mat-icon {
      color: #ff9800;
      flex-shrink: 0;
    }

    .disclaimer p {
      margin: 0;
      color: #856404;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .condition-header {
        flex-direction: column;
        gap: 12px;
        margin-bottom: 12px;
      }

      .condition-name {
        font-size: 1.1rem;
        margin-bottom: 6px;
      }

      .condition-description {
        font-size: 0.9rem;
      }

      .condition-card {
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .condition-header {
        gap: 10px;
        margin-bottom: 10px;
      }

      .condition-name {
        font-size: 1rem;
        margin-bottom: 4px;
      }

      .condition-description {
        font-size: 0.85rem;
      }

      .condition-card {
        padding: 12px;
      }

      .results-grid {
        gap: 16px;
      }
    }
  `]
})
export class ResultsComponent implements OnInit, OnDestroy {
  results: ConditionResult[] = [];
  loading = true;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(
    private service: ConditionService,
    private router: Router
  ) {}

  ngOnInit() {
    // CRITICAL: Always clear results and reset state on init to prevent stale data
    this.results = [];
    this.loading = true;
    this.error = null;
    
    // Only get symptom IDs from navigation state (not localStorage to avoid stale data)
    const navigation = this.router.getCurrentNavigation();
    let symptomIds = navigation?.extras?.state?.['symptoms'] || 
                     (window.history.state?.symptoms || null);

    // Strict check: must have valid symptom IDs array from navigation
    if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
      this.loading = false;
      this.error = 'No symptoms selected. Please go back and select symptoms first.';
      this.results = []; // Ensure results are empty
      return;
    }

    // Ensure symptom IDs are numbers
    const normalizedSymptomIds = symptomIds.map(id => 
      typeof id === 'string' ? parseInt(id, 10) : id
    ).filter(id => !isNaN(id) && id > 0); // Also check that IDs are positive

    if (normalizedSymptomIds.length === 0) {
      this.loading = false;
      this.error = 'Invalid symptom data. Please go back and select symptoms again.';
      this.results = []; // Ensure results are empty
      return;
    }

    console.log('Normalized Symptom IDs:', normalizedSymptomIds);

    // Set timeout to prevent infinite loading
    let timeoutId: any;
    timeoutId = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.error = 'Request timed out. Please try again.';
        console.error('Request timeout');
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }
    }, 15000); // 15 second timeout

    console.log('Calling service.calculate with:', normalizedSymptomIds);
    
    this.subscription = this.service.calculate(normalizedSymptomIds).subscribe({
      next: (results: ConditionResult[]) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        console.log('Results received in component:', results);
        
        // Only set results if we have valid symptom IDs and valid results
        if (normalizedSymptomIds.length === 0) {
          this.results = [];
          this.loading = false;
          this.error = 'No symptoms selected. Please go back and select symptoms first.';
          return;
        }
        
        this.results = (results && Array.isArray(results) && results.length > 0) ? results : [];
        this.loading = false;
        this.error = null;
        
        if (this.results.length === 0) {
          this.error = 'No matching conditions found for the selected symptoms.';
        }
      },
      error: (err) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        console.error('Error calculating results:', err);
        this.loading = false;
        const errorMessage = err?.message || err?.toString() || 'Unknown error';
        this.error = `Unable to calculate results: ${errorMessage}. Please make sure the JSON server is running (npm run backend).`;
        this.results = [];
      },
      complete: () => {
        console.log('Observable completed');
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}


