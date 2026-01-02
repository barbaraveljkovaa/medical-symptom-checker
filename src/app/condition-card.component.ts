import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-condition-card',
  template: `
    <div class="condition-card">
      <h3>{{ name }}</h3>
      <p>{{ description }}</p>
    </div>
  `,
  styles: [`
    .condition-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      margin: 10px 0;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    }
  `]
})
export class ConditionCardComponent {
  @Input() name!: string;
  @Input() description!: string;
}
