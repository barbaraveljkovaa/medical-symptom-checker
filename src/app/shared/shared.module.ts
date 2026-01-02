import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

import { LoadingComponent } from './loading.component';
import { ConditionCardComponent } from './condition-card.component';
import { ConfidenceBarComponent } from './confidence-bar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LoadingComponent,
    ConditionCardComponent,
    ConfidenceBarComponent
  ],
  exports: [
    MaterialModule,
    LoadingComponent,
    ConditionCardComponent,
    ConfidenceBarComponent
  ]
})
export class SharedModule {}
