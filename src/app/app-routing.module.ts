import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/symptoms/symptom.module').then(m => m.SymptomModule)
  },
  {
    path: 'results',
    loadChildren: () =>
      import('./features/results/results.module').then(m => m.ResultsModule)
  },
  {
    path: 'history',
    loadChildren: () =>
      import('./features/history/history.module').then(m => m.HistoryModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
