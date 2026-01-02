import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, catchError, of } from 'rxjs';

export interface ConditionResult {
  name: string;
  description: string;
  probability: number;
  explanation: string; // NEW: explanation for "why this result"
}

interface Condition {
  id: number;
  name: string;
  description: string;
}

interface Weight {
  symptomId: number;
  conditionId: number;
  weight: number;
}

@Injectable({ providedIn: 'root' })
export class ConditionService {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private REQUIRED_SYMPTOMS: Record<number, number[]> = {
    3: [3], // Migraine → Headache
    6: [3], // Tension Headache → Headache
  };

  calculate(symptomIds: number[]): Observable<ConditionResult[]> {
    if (!symptomIds || symptomIds.length === 0) return of([]);

    const normalizedSymptomIds = symptomIds
      .map(id => Number(id))
      .filter(id => !isNaN(id));

    const fallbackConditions: Condition[] = [
      { id: 1, name: 'Flu', description: 'Viral infection with systemic symptoms' },
      { id: 2, name: 'Common Cold', description: 'Mild upper respiratory illness' },
      { id: 3, name: 'Migraine', description: 'Neurological headache disorder' },
      { id: 4, name: 'COVID-19', description: 'Respiratory viral infection' },
      { id: 5, name: 'Food Poisoning', description: 'Gastrointestinal illness' },
      { id: 6, name: 'Tension Headache', description: 'Stress-related headache' },
      { id: 7, name: 'Sinusitis', description: 'Inflammation of the sinuses' }
    ];

    const fallbackWeights: Weight[] = [
      { symptomId: 1, conditionId: 1, weight: 0.9 },
      { symptomId: 2, conditionId: 1, weight: 0.7 },
      { symptomId: 4, conditionId: 1, weight: 0.8 },
      { symptomId: 9, conditionId: 1, weight: 0.8 },

      { symptomId: 5, conditionId: 2, weight: 0.8 },
      { symptomId: 6, conditionId: 2, weight: 0.9 },
      { symptomId: 2, conditionId: 2, weight: 0.6 },

      { symptomId: 3, conditionId: 3, weight: 0.9 },
      { symptomId: 7, conditionId: 3, weight: 0.7 },
      { symptomId: 8, conditionId: 3, weight: 0.9 },

      { symptomId: 1, conditionId: 4, weight: 0.8 },
      { symptomId: 2, conditionId: 4, weight: 0.7 },
      { symptomId: 4, conditionId: 4, weight: 0.8 },

      { symptomId: 7, conditionId: 5, weight: 0.9 },
      { symptomId: 4, conditionId: 5, weight: 0.6 },

      { symptomId: 3, conditionId: 6, weight: 0.8 },
      { symptomId: 4, conditionId: 6, weight: 0.6 },

      { symptomId: 3, conditionId: 7, weight: 0.7 },
      { symptomId: 5, conditionId: 7, weight: 0.6 },
      { symptomId: 6, conditionId: 7, weight: 0.8 }
    ];

    const calculateResults = (
      conditions: Condition[],
      weights: Weight[],
      symptoms?: { id: number; name: string }[]
    ): ConditionResult[] => {
      // Map symptomId → name for readable explanations. Prefer provided `symptoms` array when available.
      let symptomMap = new Map<number, string>();
      if (Array.isArray(symptoms) && symptoms.length > 0) {
        symptoms.forEach(s => symptomMap.set(Number(s.id), s.name));
      } else {
        symptomMap = new Map<number, string>([
          [1, 'Fever'], [2, 'Cough'], [3, 'Headache'], [4, 'Fatigue'], [5, 'Sore Throat'],
          [6, 'Runny Nose'], [7, 'Nausea'], [8, 'Sensitivity to Light'], [9, 'Muscle Pain']
        ]);
      }

      return conditions
        .map(condition => {
          const conditionId = Number(condition.id);

          const required = this.REQUIRED_SYMPTOMS[conditionId];
          if (required && !required.every(id => normalizedSymptomIds.includes(id))) {
            return {
              name: condition.name,
              description: condition.description,
              probability: 0,
              explanation: 'Missing core symptom(s) required for this condition.'
            };
          }

          const matchedWeights = weights.filter(
            w => Number(w.conditionId) === conditionId &&
                 normalizedSymptomIds.includes(Number(w.symptomId))
          );

          const matchedSum = matchedWeights.reduce((sum, w) => sum + w.weight, 0);
          const maxPossible = weights
            .filter(w => Number(w.conditionId) === conditionId)
            .reduce((sum, w) => sum + w.weight, 0);

          const probability = maxPossible > 0 ? matchedSum / maxPossible : 0;

          const symptomNames = matchedWeights.map(
            w => `${symptomMap.get(w.symptomId)} (weight ${w.weight})`
          );

          const explanation = symptomNames.length > 0
            ? `Matches selected symptoms: ${symptomNames.join(', ')}. Probability = sum of matched weights (${matchedSum.toFixed(2)}) ÷ total possible weight (${maxPossible.toFixed(2)}).`
            : 'No selected symptoms match this condition.';

          return {
            name: condition.name,
            description: condition.description,
            probability,
            explanation
          };
        })
        .filter(r => r.probability > 0)
        .sort((a, b) => b.probability - a.probability);
    };

    return new Observable<ConditionResult[]>(observer => {
      observer.next(calculateResults(fallbackConditions, fallbackWeights));

      forkJoin({
        conditions: this.http.get<Condition[]>(`${this.api}/conditions`).pipe(catchError(() => of(null))),
        weights: this.http.get<Weight[]>(`${this.api}/weights`).pipe(catchError(() => of(null))),
        symptoms: this.http.get<any[]>(`${this.api}/symptoms`).pipe(catchError(() => of(null)))
      }).subscribe({
        next: ({ conditions, weights, symptoms }) => {
          if (conditions && weights) observer.next(calculateResults(conditions, weights, symptoms || undefined));
          observer.complete();
        },
        error: () => observer.complete()
      });
    });
  }
}



