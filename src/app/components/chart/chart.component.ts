import { Component, Input, Output, EventEmitter, computed, signal, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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

  constructor(@Inject(DOCUMENT) private document: Document) {}

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

  // Detectar si estamos en modo oscuro
  private get isDarkMode(): boolean {
    return this.document.documentElement.getAttribute('data-theme') === 'dark';
  }

  // Obtener colores según el tema actual
  private getThemeColors() {
    const isDark = this.isDarkMode;
    
    return {
      // Colores de línea y gradiente
      lineColor: isDark ? '#22d3ee' : '#3b82f6',
      gradientColors: isDark 
        ? ['rgba(34, 211, 238, 0.9)', 'rgba(34, 211, 238, 0.7)', 'rgba(34, 211, 238, 0.4)', 'rgba(34, 211, 238, 0.1)']
        : ['rgba(59, 130, 246, 0.9)', 'rgba(59, 130, 246, 0.7)', 'rgba(59, 130, 246, 0.4)', 'rgba(59, 130, 246, 0.1)'],
      
      // Colores de hover
      hoverBackgroundColor: isDark ? '#22d3ee' : '#3b82f6',
      hoverBorderColor: isDark ? '#ffffff' : '#ffffff',
      
      // Colores de tooltip
      tooltipBackground: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      tooltipTitleColor: isDark ? '#f3f4f6' : '#1f2937',
      tooltipBodyColor: isDark ? '#d1d5db' : '#374151',
      tooltipBorderColor: isDark ? '#374151' : '#e5e7eb',
      
      // Colores de grid y ticks
      gridColor: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(156, 163, 175, 0.3)',
      tickColor: isDark ? '#9ca3af' : '#6b7280'
    };
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
    
    // Obtener colores del tema actual
    const themeColors = this.getThemeColors();

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Precio',
          data: data,
          borderColor: themeColors.lineColor,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, themeColors.gradientColors[0]);
            gradient.addColorStop(0.3, themeColors.gradientColors[1]);
            gradient.addColorStop(0.6, themeColors.gradientColors[2]);
            gradient.addColorStop(1, themeColors.gradientColors[3]);
            return gradient;
          },
          borderWidth: 3,
          fill: 'origin',
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: themeColors.hoverBackgroundColor,
          pointHoverBorderColor: themeColors.hoverBorderColor,
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
            backgroundColor: themeColors.tooltipBackground,
            titleColor: themeColors.tooltipTitleColor,
            bodyColor: themeColors.tooltipBodyColor,
            borderColor: themeColors.tooltipBorderColor,
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
              color: themeColors.gridColor
            },
            ticks: {
              color: themeColors.tickColor,
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
              color: themeColors.gridColor
            },
            ticks: {
              color: themeColors.tickColor,
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
