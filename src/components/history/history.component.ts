import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HistoryService, HistoryItem } from '../../services/history.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe],
  templateUrl: './history.component.html',
})
export class HistoryComponent {
  private historyService = inject(HistoryService);
  history = this.historyService.history;
}
