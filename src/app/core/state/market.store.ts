import { Injectable, signal, effect } from '@angular/core';
import { MarketService } from '../services/market.service';

type Period = '1M' | '3M' | '6M' | '1A';

@Injectable({
  providedIn: 'root'
})
export class MarketStore {

  // Signals públicas
  public selectedIndex = signal<string>('IPSA');
  public period = signal<Period>('1M');
  public constituents = signal<any[]>([]);
  public instruments = signal<any[]>([]);
  public selectedInstrument = signal<any | null>(null);
  public summary = signal<any | null>(null);
  public history = signal<any[]>([]);

  constructor(private marketService: MarketService) {
    // Efecto A: cuando cambia selectedIndex, recargar instruments
    effect(() => {
      const index = this.selectedIndex();
      this.reloadInstruments();
      
      // Si no hay selectedInstrument, seleccionar el primero disponible
      if (!this.selectedInstrument() && this.instruments().length > 0) {
        const firstInstrument = this.instruments()[0];
        if (firstInstrument) {
          this.selectedInstrument.set(firstInstrument);
        }
      }
    });

    // Efecto B: cuando cambia selectedInstrument, solicitar summary e history
    effect(() => {
      const instrument = this.selectedInstrument();
      if (instrument && instrument.symbol) {
        this.loadInstrumentData(instrument.symbol);
      }
    });

    // Efecto C: cuando cambia period (solo notifica para filtrado local)
    effect(() => {
      const currentPeriod = this.period();
      // No llama a servicio, solo notifica para que el Chart filtre localmente
    });

    // Cargar constituyentes al inicializar
    this.loadConstituents();
  }

  // Métodos públicos
  public selectIndex(id: string): void {
    this.selectedIndex.set(id);
  }

  public selectInstrument(symbol: string): void {
    const instrument = this.instruments().find(inst => inst.symbol === symbol);
    if (instrument) {
      this.selectedInstrument.set(instrument);
    }
  }

  public setPeriod(p: Period): void {
    this.period.set(p);
  }

  public loadConstituents(): void {
    this.marketService.getConstituents().subscribe({
      next: (data) => {
        this.constituents.set(data);
        this.instruments.set(data); // Reutilizar constituents para instruments
        
        // Si no hay selectedInstrument y hay instrumentos, seleccionar el primero
        if (!this.selectedInstrument() && data && data.length > 0) {
          this.selectedInstrument.set(data[0]);
        }
      },
      error: (error) => {
        console.error('Error loading constituents:', error);
        // Set empty arrays as fallback
        this.constituents.set([]);
        this.instruments.set([]);
      }
    });
  }

  // Métodos privados auxiliares
  private reloadInstruments(): void {
    // Por ahora, usar constituents como instruments
    // En el futuro se puede filtrar según selectedIndex
    this.instruments.set(this.constituents());
  }

  private loadInstrumentData(symbol: string): void {
    // Cargar summary
    this.marketService.getSummary(symbol).subscribe({
      next: (summaryData) => {
        this.summary.set(summaryData);
      },
      error: (error) => {
        console.error('Error loading summary for', symbol, ':', error);
        this.summary.set(null);
      }
    });

    // Cargar history
    this.marketService.getHistory(symbol).subscribe({
      next: (historyData) => {
        this.history.set(historyData);
      },
      error: (error) => {
        console.error('Error loading history for', symbol, ':', error);
        this.history.set([]);
      }
    });
  }
}