import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, of, throwError, concat } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Symptom } from '../../models/symptom-model';

export type { Symptom } from '../../models/symptom-model';

@Injectable({ providedIn: 'root' })
export class SymptomService {
  private api = 'http://localhost:3000/symptoms';
  private fallbackSymptoms: Symptom[] = [
    { id: 1, name: 'Fever' },
    { id: 2, name: 'Cough' },
    { id: 3, name: 'Headache' },
    { id: 4, name: 'Fatigue' },
    { id: 5, name: 'Sore Throat'},
    { id: 6, name: 'Runny Nose'},
    { id: 7, name: 'Nausea'},
    { id: 8, name: 'Sensitivity to Light'},
    { id: 9, name: 'Muscle Pain'}
  ];

  constructor(private http: HttpClient) {}

  getSymptoms(): Observable<Symptom[]> {
    // Emit fallback immediately so UI shows something, then attempt API request
    const http$ = this.http.get<any[]>(this.api).pipe(
      timeout({
        each: 5000, // 5 second timeout
        with: () => throwError(() => new Error('Request timeout'))
      }),
      map(data => {
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format');
        }
        // Convert string IDs to numbers if needed
        return data.map(item => ({
          id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
          name: item.name
        }));
      }),
      retry({ count: 1, delay: 500 }),
      catchError((error) => {
        console.warn('API unavailable, keeping fallback symptoms:', error);
        return of(this.fallbackSymptoms);
      })
    );

    return concat(of(this.fallbackSymptoms), http$);
  }
}
