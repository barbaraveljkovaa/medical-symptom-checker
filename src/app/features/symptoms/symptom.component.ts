import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SymptomService } from '../../core/services/symptom.service';
import { Symptom } from '../../models/symptom-model';

@Component({
  selector: 'app-symptom',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h2>Select Symptoms</h2>
    <ul>
      <li *ngFor="let s of symptoms">{{ s.name }}</li>
    </ul>
    <button routerLink="/results">See Results</button>
  `
})
export class SymptomComponent implements OnInit {
  symptoms: Symptom[] = [];

  constructor(private service: SymptomService) {}

  ngOnInit() {
    this.service.getSymptoms().subscribe(data => {
      this.symptoms = data;
    });
  }
}
