import { Injectable, signal } from '@angular/core';
import { MarketService } from '../services/market.service';

type Period = '1D' | '1S' | '1M' | '3M' | '6M' | '1A' | '5A';

@Injectable({
  providedIn: 'root'
})
export class MarketStore {

  // Constante para campo de índice detectado (no existe en el JSON actual)
  private readonly INDEX_FIELD: string | null = null;

  // Signals públicas
  public selectedIndex = signal<string>('IPSA');
  public period = signal<Period>('1M');
  public constituents = signal<any[]>([]);
  public instruments = signal<any[]>([]);
  public selectedInstrument = signal<any | null>(null);
  public summary = signal<any | null>(null);
  public history = signal<any[]>([]);

  constructor(private marketService: MarketService) {
    // Cargar constituyentes al inicializar
    this.loadConstituents();
  }

  // Métodos públicos
  public selectIndex(id: string): void {
    this.selectedIndex.set(id);
    
    // Cargar constituyentes específicos del índice seleccionado
    this.marketService.getConstituentsByIndex(id).subscribe({
      next: (response) => {
        const constituents = response?.data?.constituents || [];
        this.constituents.set(constituents);
        this.instruments.set(constituents);
        
        // Auto-seleccionar el primer instrumento
        if (constituents.length > 0) {
          const firstInstrument = constituents[0];
          this.selectInstrument(firstInstrument.codeInstrument, true);
        }
      },
      error: (error) => {
        console.error('Error loading constituents for index', id, ':', error);
        // Fallback: usar constituyentes existentes
        const list = this.constituents();
        this.instruments.set(list);
        if (list.length > 0) {
          this.selectInstrument(list[0].codeInstrument, true);
        }
      }
    });
  }

  public selectInstrument(symbol: string, force: boolean = false): void {
    const currentSymbol = this.selectedInstrument()?.codeInstrument;
    
    if (force || currentSymbol !== symbol) {
      // Buscar el instrumento en la lista actual
      const instrument = this.instruments().find(inst => inst.codeInstrument === symbol);
      if (instrument) {
        this.selectedInstrument.set(instrument);
        
        // Cargar SIEMPRE summary e history
        this.loadInstrumentData(symbol);
      }
    }
  }

  public setPeriod(p: Period): void {
    this.period.set(p);
  }

  // Método de inicialización
  public async loadConstituents(): Promise<void> {
    // Cargar constituyentes del índice por defecto (IPSA)
    this.marketService.getConstituentsByIndex('IPSA').subscribe({
      next: (response) => {
        const constituents = response?.data?.constituents || [];
        this.constituents.set(constituents);
        this.instruments.set(constituents);
        
        // Auto-seleccionar el primer instrumento
        if (constituents.length > 0) {
          const firstInstrument = constituents[0];
          this.selectInstrument(firstInstrument.codeInstrument, true);
        }
      },
      error: (error) => {
        console.error('Error loading initial constituents:', error);
      }
    });
  }

  // Método para generar datos mock para otros índices
  private generateMockDataForIndex(indexId: string): any[] {
    const baseInstruments = [
      { name: 'Apple Inc.', shortName: 'AAPL', codeInstrument: 'AAPL' },
      { name: 'Microsoft Corporation', shortName: 'MSFT', codeInstrument: 'MSFT' },
      { name: 'Amazon.com Inc.', shortName: 'AMZN', codeInstrument: 'AMZN' },
      { name: 'Alphabet Inc.', shortName: 'GOOGL', codeInstrument: 'GOOGL' },
      { name: 'Tesla Inc.', shortName: 'TSLA', codeInstrument: 'TSLA' }
    ];

    return baseInstruments.map((instrument, index) => ({
      ...instrument,
      codeInstrument: `${indexId}_${instrument.codeInstrument}`,
      lastPrice: Math.random() * 1000 + 100,
      pctDay: (Math.random() - 0.5) * 10,
      datetimeLastPrice: new Date().toISOString()
    }));
  }

  // Método para generar datos históricos mock
  private generateMockHistory(instrumentCode: string): any {
    const chartData = [];
    const basePrice = Math.random() * 1000 + 100;
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 20;
      const price = Math.max(basePrice + variation, 10);
      
      chartData.push({
        datetimeLastPrice: date.toISOString(),
        lastPrice: price,
        highPrice: price * 1.05,
        lowPrice: price * 0.95,
        openPrice: price * 0.98,
        closePrice: price,
        volume: Math.floor(Math.random() * 1000000),
        performance: variation
      });
    }

    return {
      success: true,
      code: 200,
      data: {
        info: {
          instrument: instrumentCode,
          market: 'Mock Market'
        },
        chart: chartData
      }
    };
  }

  private loadInstrumentData(symbol: string): void {
    // Cargar datos reales desde archivos JSON
    this.marketService.getSummary(symbol).subscribe({
      next: (data) => this.summary.set(data),
      error: (error) => console.error('Error loading summary for', symbol, ':', error)
    });

    this.marketService.getHistory(symbol).subscribe({
      next: (data) => this.history.set(data),
      error: (error) => console.error('Error loading history for', symbol, ':', error)
    });
  }
}