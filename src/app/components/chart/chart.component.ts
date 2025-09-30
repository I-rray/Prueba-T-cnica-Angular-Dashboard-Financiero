import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Period = '1M' | '3M' | '6M' | '1A';

@Component({
  selector: 'app-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {

  @Input() points: any[] = [];
  @Input() period: Period = '1M';
  @Output() periodChange = new EventEmitter<Period>();

  // Array de periodos para el template
  periods: Period[] = ['1M', '3M', '6M', '1A'];

  // Computed para obtener los puntos filtrados según el periodo
  get filteredPoints(): any[] {
    if (!this.points || this.points.length === 0) {
      return [];
    }

    const totalPoints = this.points.length;
    let pointsToShow: number;

    switch (this.period) {
      case '1M':
        pointsToShow = Math.min(30, totalPoints); // últimos ~30 puntos
        break;
      case '3M':
        pointsToShow = Math.min(90, totalPoints); // últimos ~90 puntos
        break;
      case '6M':
        pointsToShow = Math.min(180, totalPoints); // últimos ~180 puntos
        break;
      case '1A':
        pointsToShow = Math.min(365, totalPoints); // últimos ~365 puntos
        break;
      default:
        pointsToShow = totalPoints;
    }

    // Retornar los últimos N puntos
    return this.points.slice(-pointsToShow);
  }

  onPeriodClick(period: Period): void {
    this.periodChange.emit(period);
  }
}
