import { Component, computed, signal } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TabSwitcherComponent } from '../../components/tab-switcher/tab-switcher.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { SummaryComponent } from '../../components/summary/summary.component';
import { InstrumentListComponent } from '../../components/instrument-list/instrument-list.component';
import { MarketStore } from '../../core/state/market.store';

type Period = '1D' | '1S' | '1M' | '3M' | '6M' | '1A' | '5A';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    SearchBarComponent,
    HeaderComponent,
    TabSwitcherComponent,
    ChartComponent,
    SummaryComponent,
    InstrumentListComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {

  // Estado local para filtrado
  public query = signal<string>('');

  // Computed para filtrar instrumentos en memoria
  public filteredInstruments = computed(() => {
    const instruments = this.marketStore.instruments();
    const searchQuery = this.query().toLowerCase().trim();
    
    if (!searchQuery) {
      return instruments;
    }
    
    return instruments.filter((instrument: any) => 
      instrument?.codeInstrument?.toLowerCase().includes(searchQuery) ||
      instrument?.shortName?.toLowerCase().includes(searchQuery) ||
      instrument?.name?.toLowerCase().includes(searchQuery)
    );
  });

  // Computed para el título del índice
  indexTitle = computed(() => {
    const selectedIndex = this.marketStore.selectedIndex();
    return `${selectedIndex}, CHILE`;
  });

  // Computed property para mapear history a formato de chart
  chartPoints = computed(() => {
    const historyResponse = this.marketStore.history();
    
    // Verificar si historyResponse es un objeto con data.chart o un array directo
    let historyArray: any[] = [];
    
    if (historyResponse && typeof historyResponse === 'object') {
      if (Array.isArray(historyResponse)) {
        // Es un array directo
        historyArray = historyResponse;
      } else if ((historyResponse as any).data && (historyResponse as any).data.chart) {
        // Es un objeto con data.chart
        historyArray = (historyResponse as any).data.chart;
      }
    }
    
    if (!Array.isArray(historyArray) || historyArray.length === 0) return [];
    
    return historyArray.map((item: any) => ({
      t: item.datetimeLastPrice,
      v: item.lastPrice
    }));
  });

  // Computed property para el SummaryComponent - devuelve array plano de datos históricos
  historyArray = computed(() => {
    const historyResponse = this.marketStore.history();
    
    // Verificar si historyResponse es un objeto con data.chart o un array directo
    let historyArray: any[] = [];
    
    if (historyResponse && typeof historyResponse === 'object') {
      if (Array.isArray(historyResponse)) {
        // Es un array directo
        historyArray = historyResponse;
      } else if ((historyResponse as any).data && (historyResponse as any).data.chart) {
        // Es un objeto con data.chart
        historyArray = (historyResponse as any).data.chart;
      }
    }
    
    if (!Array.isArray(historyArray) || historyArray.length === 0) return [];
    
    // Para el SummaryComponent, devolver el array con el formato esperado
    return historyArray.map((item: any) => ({
      datetimeLastPrice: item.datetimeLastPrice,
      lastPrice: item.lastPrice
    }));
  });

  // Índices estáticos según requerimientos
  public indices = ['IPSA', 'IGPA', 'NASDAQ', 'DOW JONES', 'SP/BVL'];

  constructor(public marketStore: MarketStore) {}

  // Handlers para eventos de componentes
  onQueryChange(newQuery: string): void {
    this.query.set(newQuery);
  }

  onIndexChange(indexId: string): void {
    this.marketStore.selectIndex(indexId);
  }

  onInstrumentSelect(instrument: any): void {
    if (instrument?.codeInstrument) {
      this.marketStore.selectInstrument(instrument.codeInstrument);
    }
  }

  onPeriodChange(period: Period): void {
    // Para los nuevos periodos 1D y 1S, también llamar a setPeriod
    // La store solo guarda el valor; el slicing lo hace el chart
    this.marketStore.setPeriod(period);
  }
}
