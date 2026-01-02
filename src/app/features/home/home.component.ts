import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <mat-card class="hero-card">
          <mat-card-content>
            <div class="hero-content">
              <mat-icon class="hero-icon">local_hospital</mat-icon>
              <h1 class="hero-title">Medical Symptom Checker</h1>
              <p class="hero-subtitle">
                Get instant insights about potential health conditions based on your symptoms
              </p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="info-section">
        <div class="cta-section">
          <button 
            mat-raised-button 
            color="primary" 
            routerLink="/symptoms"
            class="cta-button">
            <mat-icon>arrow_forward</mat-icon>
            <span>Start Symptom Check</span>
          </button>
        </div>

        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>info</mat-icon>
              How It Works
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h3>Select Your Symptoms</h3>
                  <p>Choose from a list of common symptoms that you're experiencing. You can select multiple symptoms and prioritize them by dragging.</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h3>Get Analysis</h3>
                  <p>Our system analyzes your symptoms using a weighted algorithm to match them with potential medical conditions.</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h3>Review Results</h3>
                  <p>View detailed results with probability scores and descriptions for each potential condition.</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="disclaimer-card">
          <mat-card-content>
            <div class="disclaimer-content">
              <mat-icon class="warning-icon">warning</mat-icon>
              <div class="disclaimer-text">
                <h3>Important Disclaimer</h3>
                <p>
                  This is a <strong>demonstration tool</strong> and should <strong>not be used for actual medical diagnosis</strong>. 
                  The results are based on algorithmic calculations and are not a substitute for professional medical advice.
                </p>
                <p>
                  If you have serious symptoms or concerns about your health, please consult with a qualified healthcare professional immediately.
                </p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      animation: fadeIn 0.5s ease-in;
      padding: 20px 0;
      min-height: calc(100vh - 64px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .hero-section {
      margin-bottom: 40px;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding: 0 20px;
    }

    .hero-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .hero-content {
      text-align: center;
      padding: 40px 20px;
    }

    .hero-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
      opacity: 0.9;
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 600;
      margin: 0 0 16px 0;
      letter-spacing: 0.5px;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      margin: 0;
      opacity: 0.95;
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .info-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    mat-card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      margin: -16px -16px 24px -16px;
      border-radius: 16px 16px 0 0;
    }

    mat-card-header mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    mat-card-header mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 32px;
      padding: 8px 0;
    }

    .step {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }

    .step-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .step-content h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .step-content p {
      margin: 0;
      color: #666;
      line-height: 1.6;
      font-size: 1rem;
    }

    .disclaimer-card {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .disclaimer-content {
      display: flex;
      gap: 16px;
      padding: 8px 0;
    }

    .warning-icon {
      color: #ff9800;
      font-size: 40px;
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      margin-top: 4px;
    }

    .disclaimer-text h3 {
      margin: 0 0 12px 0;
      color: #856404;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .disclaimer-text p {
      margin: 0 0 12px 0;
      color: #856404;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .disclaimer-text p:last-child {
      margin-bottom: 0;
    }

    .cta-section {
      text-align: center;
      padding: 20px 0;
    }

    .cta-button {
      padding: 16px 48px !important;
      font-size: 1.2rem;
      border-radius: 30px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    .cta-button mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .step {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .step-number {
        margin-bottom: 8px;
      }

      .disclaimer-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .cta-button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HomeComponent {}

