import { Injectable, signal } from '@angular/core';

export interface HistoryItem {
  id: string;
  type: 'video-creation' | 'image-to-video' | 'website-creator' | 'app-creator' | 'viral-video';
  timestamp: number;
  input: Record<string, any>;
  output: Record<string, any>;
  title: string;
}

const HISTORY_STORAGE_KEY = 'hg-tec-history';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  history = signal<HistoryItem[]>([]);

  constructor() {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (storedHistory) {
      this.history.set(JSON.parse(storedHistory));
    }
  }

  addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>) {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    this.history.update(currentHistory => [newItem, ...currentHistory]);
    this.saveHistory();
  }

  getHistory(): HistoryItem[] {
    return this.history();
  }
  
  private saveHistory() {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history()));
  }
}