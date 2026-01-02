import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  template: `
    <nav>
      <a routerLink="/">Symptoms</a> |
      <a routerLink="/results">Results</a> |
      <a routerLink="/history">History</a>
    </nav>

    <router-outlet></router-outlet>
  `,
  styleUrl: './app.css'
})
export class App {}
