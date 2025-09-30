import { Component, computed, signal } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TabSwitcherComponent } from '../../components/tab-switcher/tab-switcher.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { SummaryComponent } from '../../components/summary/summary.component';
import { InstrumentListComponent } from '../../components/instrument-list/instrument-list.component';
import { MarketStore } from '../../core/state/market.store';

type Period = '1M' | '3M' | '6M' | '1A';

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
    
    return instruments.filter(instrument => 
      instrument?.symbol?.toLowerCase().includes(searchQuery) ||
      instrument?.name?.toLowerCase().includes(searchQuery)
    );
  });

  // Índices estáticos (fallback si no hay lista)
  public indices = ['IPSA'];

  constructor(public marketStore: MarketStore) {}

  // Handlers para eventos de componentes
  onQueryChange(newQuery: string): void {
    this.query.set(newQuery);
  }

  onIndexChange(indexId: string): void {
    this.marketStore.selectIndex(indexId);
  }

  onInstrumentSelect(instrument: any): void {
    if (instrument?.symbol) {
      this.marketStore.selectInstrument(instrument.symbol);
    }
  }

  onPeriodChange(period: Period): void {
    this.marketStore.setPeriod(period);
  }
}
