import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SummaryVM {
  info: {
    symbol: string;              // instrument.codeInstrument
    name: string;                // instrument.name || instrument.shortName
    marketName: string;          // por defecto "Bolsa de Santiago"
    hourOpen?: string;           // opcional
    hourClose?: string;          // opcional
  };
  price: {
    lastPrice?: number;          // instrument.lastPrice
    datetimeLastPrice?: string;  // instrument.datetimeLastPrice
    openPrice?: number;          // 1er precio del día (history filtrado a "hoy")
    closePrev?: number;          // último precio del día anterior (history)
    maxDay?: number;             // máx del día actual (history)
    minDay?: number;             // mín del día actual (history)
    max52W?: number;             // máx últimos 365 días (history)
    min52W?: number;             // mín últimos 365 días (history)
    volumeMoney?: number;        // instrument.volumeMoney
    pctDay?: number;             // instrument.pctDay
    pct30D?: number;             // instrument.pct30D
    pctCY?: number;              // instrument.pctCY
    pct1Y?: number;              // instrument.pct1Y
  };
  perf: {                        // bloque "Variación** %"
    m1?: number;                 // = pct30D
    y1?: number;                 // = pct1Y
    ytd?: number;                // = pctCY
  };
}

@Component({
  selector: 'app-summary',
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnChanges {

  @Input() instrument: any | null = null;
  @Input() history: Array<{ datetimeLastPrice: string; lastPrice: number }> = [];
  @Input() period: string = '1A'; // Default period
  
  activeTab: 'resumen' | 'detalles' = 'resumen';
  vm: SummaryVM | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instrument'] || changes['history'] || changes['period']) {
      this.buildViewModel();
    }
  }

  setActiveTab(tab: 'resumen' | 'detalles'): void {
    this.activeTab = tab;
  }

  private buildViewModel(): void {
    if (!this.instrument) {
      this.vm = null;
      return;
    }

    // Filter history based on period (same logic as chart component)
    const filteredHistory = this.getFilteredHistory();

    // Calcular "hoy" como la fecha máxima del history filtrado
    const today = this.getTodayFromHistory(filteredHistory);
    const todaySeries = this.getTodaySeries(today, filteredHistory);
    const closePrev = this.getClosePrev(today, filteredHistory);
    const range52W = this.get52WeekRange(today, filteredHistory);

    this.vm = {
      info: {
        symbol: this.instrument.codeInstrument || '',
        name: this.instrument.name || this.instrument.shortName || '',
        marketName: 'Bolsa de Santiago',
        hourOpen: undefined,
        hourClose: undefined
      },
      price: {
        lastPrice: this.instrument.lastPrice,
        datetimeLastPrice: this.instrument.datetimeLastPrice,
        openPrice: todaySeries.length > 0 ? todaySeries[0].lastPrice : undefined,
        closePrev: closePrev,
        maxDay: todaySeries.length > 0 ? Math.max(...todaySeries.map(p => p.lastPrice)) : undefined,
        minDay: todaySeries.length > 0 ? Math.min(...todaySeries.map(p => p.lastPrice)) : undefined,
        max52W: range52W.length > 0 ? Math.max(...range52W.map(p => p.lastPrice)) : undefined,
        min52W: range52W.length > 0 ? Math.min(...range52W.map(p => p.lastPrice)) : undefined,
        volumeMoney: this.instrument.volumeMoney,
        pctDay: this.instrument.pctDay,
        pct30D: this.instrument.pct30D,
        pctCY: this.instrument.pctCY,
        pct1Y: this.instrument.pct1Y
      },
      perf: {
        m1: this.instrument.pct30D,
        y1: this.instrument.pct1Y,
        ytd: this.instrument.pctCY
      }
    };
  }

  private getFilteredHistory(): Array<{ datetimeLastPrice: string; lastPrice: number }> {
    if (!this.history || this.history.length === 0) {
      return [];
    }

    const totalPoints = this.history.length;
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
    return this.history.slice(-pointsToShow);
  }

  private getTodayFromHistory(history: Array<{ datetimeLastPrice: string; lastPrice: number }>): string | null {
    if (history.length === 0) return null;
    
    try {
      const validDates = history
        .map(p => {
          const date = new Date(p.datetimeLastPrice);
          return isNaN(date.getTime()) ? null : date.getTime();
        })
        .filter(time => time !== null) as number[];
      
      if (validDates.length === 0) return null;
      
      const maxDateTime = Math.max(...validDates);
      return new Date(maxDateTime).toISOString().split('T')[0]; // YYYY-MM-DD
    } catch (error) {
      console.error('Error processing dates in getTodayFromHistory:', error);
      return null;
    }
  }

  private getTodaySeries(today: string | null, history: Array<{ datetimeLastPrice: string; lastPrice: number }>): Array<{ datetimeLastPrice: string; lastPrice: number }> {
    if (!today) return [];
    
    return history.filter(p => {
      try {
        return p.datetimeLastPrice && p.datetimeLastPrice.startsWith(today);
      } catch (error) {
        console.error('Error filtering today series:', error);
        return false;
      }
    });
  }

  private getClosePrev(today: string | null, history: Array<{ datetimeLastPrice: string; lastPrice: number }>): number | undefined {
    if (!today) return undefined;
    
    try {
      const prevPoints = history.filter(p => {
        if (!p.datetimeLastPrice) return false;
        return p.datetimeLastPrice < today;
      });
      
      if (prevPoints.length === 0) return undefined;
      
      // Ordenar por fecha descendente y tomar el primero (más reciente del día anterior)
      prevPoints.sort((a, b) => b.datetimeLastPrice.localeCompare(a.datetimeLastPrice));
      return prevPoints[0].lastPrice;
    } catch (error) {
      console.error('Error getting previous close:', error);
      return undefined;
    }
  }

  private get52WeekRange(today: string | null, history: Array<{ datetimeLastPrice: string; lastPrice: number }>): Array<{ datetimeLastPrice: string; lastPrice: number }> {
    if (!today) return [];
    
    try {
      const todayDate = new Date(today);
      if (isNaN(todayDate.getTime())) {
        console.error('Invalid today date:', today);
        return [];
      }
      
      const year365Ago = new Date(todayDate.getTime() - (365 * 24 * 60 * 60 * 1000));
      
      return history.filter(p => {
        if (!p.datetimeLastPrice) return false;
        
        const pointDate = new Date(p.datetimeLastPrice);
        if (isNaN(pointDate.getTime())) {
          console.warn('Invalid date in history:', p.datetimeLastPrice);
          return false;
        }
        
        return pointDate >= year365Ago && pointDate <= todayDate;
      });
    } catch (error) {
      console.error('Error getting 52 week range:', error);
      return [];
    }
  }

  // Helpers de formato
  fmt2(n?: number): string {
    return n !== undefined && n !== null ? n.toFixed(2) : '—';
  }

  fmtInt(n?: number): string {
    if (n === undefined || n === null) return '—';
    return Math.round(n).toLocaleString('es-CL');
  }

  fmtPct(n?: number): string {
    if (n === undefined || n === null) return '—';
    const sign = n > 0 ? '+' : '';
    return `${sign}${n.toFixed(2)}%`;
  }

  pctClass(n?: number): 'pos' | 'neg' | 'neu' {
    if (n === undefined || n === null || n === 0) return 'neu';
    return n > 0 ? 'pos' : 'neg';
  }
}
