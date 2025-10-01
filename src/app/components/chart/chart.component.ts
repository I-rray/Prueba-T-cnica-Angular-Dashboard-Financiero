import { Component, Input, Output, EventEmitter, computed, signal, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

type Period = '1D' | '1S' | '1M' | '3M' | '6M' | '1A' | '5A';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() points: any[] = [];
  @Input() period: Period = '1D';
  @Output() periodChange = new EventEmitter<Period>();

  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart | null = null;

  // Array de periodos para el template en el orden exacto solicitado
  periods: Period[] = ['1D', '1S', '1M', '3M', '6M', '1A', '5A'];

  ngOnInit(): void {
    // Initialization logic if needed
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] && this.chart) {
      this.updateChart();
    }
  }

  // Computed para obtener los puntos filtrados según el periodo
  get filteredPoints(): any[] {
    if (!this.points || this.points.length === 0) {
      return [];
    }

    const totalPoints = this.points.length;
    let pointsToShow: number;

    switch (this.period) {
      case '1D':
        pointsToShow = Math.min(2, totalPoints); // últimos 1-2 puntos (1 día)
        break;
      case '1S':
        pointsToShow = Math.min(7, totalPoints); // últimos 5-7 puntos (1 semana)
        break;
      case '1M':
        pointsToShow = Math.min(30, totalPoints); // últimos 22-30 puntos
        break;
      case '3M':
        pointsToShow = Math.min(90, totalPoints); // últimos 66-90 puntos
        break;
      case '6M':
        pointsToShow = Math.min(180, totalPoints); // últimos 132-180 puntos
        break;
      case '1A':
        pointsToShow = Math.min(365, totalPoints); // últimos 252-365 puntos
        break;
      case '5A':
        pointsToShow = Math.min(1260, totalPoints); // últimos 1260 puntos (o todos si hay menos)
        break;
      default:
        pointsToShow = totalPoints;
    }

    // Retornar los últimos N puntos
    return this.points.slice(-pointsToShow);
  }

  get hasData(): boolean {
    return this.filteredPoints.length > 0;
  }

  get pointsCount(): number {
    return this.filteredPoints.length;
  }

  private createChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir chart anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    const filteredData = this.filteredPoints;
    const labels = filteredData.map(p => p.t);
    const data = filteredData.map(p => p.v);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Precio',
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) {
      this.createChart();
      return;
    }

    const filteredData = this.filteredPoints;
    const labels = filteredData.map(p => p.t);
    const data = filteredData.map(p => p.v);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  onPeriodClick(period: Period): void {
    this.periodChange.emit(period);
    // Actualizar el gráfico cuando cambie el periodo
    setTimeout(() => this.updateChart(), 0);
  }
}
