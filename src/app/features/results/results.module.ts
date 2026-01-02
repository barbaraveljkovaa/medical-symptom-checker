import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared/shared.module';
import { ResultsComponent } from './results.component';

const routes: Routes = [
  { path: '', component: ResultsComponent }
];

@NgModule({
  declarations: [ResultsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ResultsModule {}



