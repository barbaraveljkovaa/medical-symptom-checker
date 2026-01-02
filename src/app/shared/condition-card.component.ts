import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-condition-card',
  standalone: true,
  template: `
    <div class="condition-card">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  `
})
export class ConditionCardComponent {
  @Input() title = '';
  @Input() description = '';
}
