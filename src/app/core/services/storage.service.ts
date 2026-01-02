import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly HISTORY_KEY = 'symptomHistory';

  constructor() { }

  
  getHistory(): string[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  }

  addToHistory(item: string): void {
    const currentHistory = this.getHistory();
    currentHistory.push(item);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(currentHistory));
  }


  clearHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
  }
}
