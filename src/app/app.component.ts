import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="app-toolbar">
      <div class="toolbar-content">
        <a class="logo" routerLink="/">
          <mat-icon class="logo-icon">local_hospital</mat-icon>
          <span class="logo-text">Symptom Checker</span>
        </a>
        <nav class="nav-buttons">
          <button 
            mat-button 
            routerLink="/" 
            [class.active]="isActiveRoute('/')"
            class="nav-button">
            <mat-icon>home</mat-icon>
            <span>Home</span>
          </button>
          <button 
            mat-button 
            routerLink="/symptoms" 
            [class.active]="isActiveRoute('/symptoms')"
            class="nav-button">
            <mat-icon>sick</mat-icon>
            <span>Symptoms</span>
          </button>
          <button 
            mat-button 
            routerLink="/results"
            [class.active]="isActiveRoute('/results')"
            class="nav-button">
            <mat-icon>assessment</mat-icon>
            <span>Results</span>
          </button>
          <button 
            mat-button 
            routerLink="/history"
            [class.active]="isActiveRoute('/history')"
            class="nav-button">
            <mat-icon>history</mat-icon>
            <span>History</span>
          </button>
        </nav>
      </div>
    </mat-toolbar>

    <div class="container" [class.results-page]="isActiveRoute('/results')" [class.home-page]="isActiveRoute('/')">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-toolbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.3rem;
      font-weight: 600;
      color: white;
      text-decoration: none;
      cursor: pointer;
      transition: opacity 0.3s ease;
    }

    .logo:hover {
      opacity: 0.9;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .logo-text {
      letter-spacing: 0.5px;
    }

    .nav-buttons {
      display: flex;
      gap: 5px;
    }

    .nav-button {
      color: rgba(255, 255, 255, 0.9) !important;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px !important;
      border-radius: 20px;
      transition: all 0.3s ease;
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      transform: translateY(-2px);
    }

    .nav-button.active {
      background: rgba(255, 255, 255, 0.2) !important;
      font-weight: 600;
    }

    .nav-button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .container {
      padding: 30px 20px;
      max-width: 1200px;
      margin: 0 auto;
      min-height: calc(100vh - 64px);
      overflow-x: hidden;
      background: transparent;
    }
    
    /* Full width container for results and home pages */
    .container.results-page,
    .container.home-page {
      padding: 0;
      max-width: 100%;
      margin: 0;
    }
    
    .container.results-page ::ng-deep app-results {
      display: block;
    }
    
    .container.home-page ::ng-deep app-home {
      display: block;
    }

    @media (max-width: 768px) {
      .toolbar-content {
        flex-direction: column;
        gap: 15px;
        padding: 15px;
      }

      .nav-buttons {
        width: 100%;
        justify-content: space-around;
      }

      .nav-button span {
        display: none;
      }

      .logo-text {
        font-size: 1.1rem;
      }
    }
  `]
})
export class AppComponent {
  constructor(private router: Router) {}

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}

