import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SymptomSelectorComponent } from './symptom-selector.component';

const routes: Routes = [
  { path: '', component: SymptomSelectorComponent }
];

@NgModule({
  declarations: [SymptomSelectorComponent],
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes)
  ]
})
export class SymptomModule {}
