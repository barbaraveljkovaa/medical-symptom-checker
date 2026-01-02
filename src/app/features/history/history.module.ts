import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HistoryComponent } from './history.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: HistoryComponent }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,      // for shared components like LoadingComponent or ConditionCardComponent
    RouterModule.forChild(routes),
    HistoryComponent
  ]
})
export class HistoryModule {}
