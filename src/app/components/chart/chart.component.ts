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
          borderColor: '#22d3ee',
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(34, 211, 238, 0.9)');
            gradient.addColorStop(0.3, 'rgba(34, 211, 238, 0.7)');
            gradient.addColorStop(0.6, 'rgba(34, 211, 238, 0.4)');
            gradient.addColorStop(1, 'rgba(34, 211, 238, 0.1)');
            return gradient;
          },
          borderWidth: 3,
          fill: 'origin',
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#22d3ee',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#f3f4f6',
            bodyColor: '#d1d5db',
            borderColor: '#374151',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: true,
              color: 'rgba(75, 85, 99, 0.3)'
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 11
              },
              maxTicksLimit: 8
            }
          },
          y: {
            display: true,
            beginAtZero: false,
            position: 'right',
            grid: {
              display: true,
              color: 'rgba(75, 85, 99, 0.3)'
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 11
              },
              callback: function(value: any) {
                return new Intl.NumberFormat('es-CL', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(value);
              }
            }
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
