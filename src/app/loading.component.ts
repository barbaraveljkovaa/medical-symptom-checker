import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-spinner">
      Loading...
    </div>
  `,
  styles: [`
    .loading-spinner {
      font-size: 1.2rem;
      text-align: center;
      margin: 20px 0;
    }
  `]
})
export class LoadingComponent {}
