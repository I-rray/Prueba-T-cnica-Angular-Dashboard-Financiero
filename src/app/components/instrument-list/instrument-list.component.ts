import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type SortDirection = 'asc' | 'desc';
type SortColumn = 'name' | 'lastPrice' | 'volumeMoney' | 'pctDay' | 'pct30D' | 'pctCY' | 'pct1Y';

@Component({
  selector: 'app-instrument-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instrument-list.component.html',
  styleUrl: './instrument-list.component.scss'
})
export class InstrumentListComponent {

  @Input() instruments: any[] = [];
  @Input() selectedInstrument: any | null = null;
  @Input() query?: string;
  @Output() select = new EventEmitter<any>();

  // Sorting state
  sortColumn: SortColumn = 'name';
  sortDirection: SortDirection = 'asc';

  // Column definitions for headers
  columns = [
    { key: 'name' as SortColumn, label: 'Nombre' },
    { key: 'lastPrice' as SortColumn, label: 'Último' },
    { key: 'volumeMoney' as SortColumn, label: 'Monto (MM)' },
    { key: 'pctDay' as SortColumn, label: 'Var día %' },
    { key: 'pct30D' as SortColumn, label: 'Var 30d %' },
    { key: 'pctCY' as SortColumn, label: 'Año actual %' },
    { key: 'pct1Y' as SortColumn, label: '12 meses %' }
  ];

  get filteredAndSortedInstruments(): any[] {
    let filtered = this.instruments;

    // Apply text filter if query is provided
    if (this.query && this.query.trim()) {
      const searchTerm = this.query.toLowerCase().trim();
      filtered = filtered.filter(instrument =>
        (instrument.codeInstrument?.toLowerCase() || '').includes(searchTerm) ||
        (instrument.shortName?.toLowerCase() || '').includes(searchTerm) ||
        (instrument.name?.toLowerCase() || '').includes(searchTerm)
      );
    }

    // Apply sorting
    return this.sortInstruments(filtered, this.sortColumn, this.sortDirection);
  }

  get leftTableData(): any[] {
    return this.splitInTwo(this.filteredAndSortedInstruments).left;
  }

  get rightTableData(): any[] {
    return this.splitInTwo(this.filteredAndSortedInstruments).right;
  }

  onSort(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  onRowClick(instrument: any): void {
    this.select.emit(instrument);
  }

  isSelected(instrument: any): boolean {
    return this.selectedInstrument &&
           this.selectedInstrument.codeInstrument === instrument.codeInstrument;
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  // Helper functions
  fmtNum2(v: number): string {
    return v?.toFixed(2) || '—';
  }

  fmtMM(v?: number): string {
    return v !== undefined ? (v / 1_000_000).toFixed(2) : '—';
  }

  fmtPct(v?: number): string {
    if (v === undefined || v === null) return '—';
    const sign = v > 0 ? '+' : '';
    return `${sign}${v.toFixed(2)}%`;
  }

  valClass(v?: number): string {
    if (v === undefined || v === null || v === 0) return 'neu';
    return v > 0 ? 'pos' : 'neg';
  }

  splitInTwo<T>(arr: T[]): { left: T[]; right: T[] } {
    const mid = Math.ceil(arr.length / 2);
    return {
      left: arr.slice(0, mid),
      right: arr.slice(mid)
    };
  }

  private sortInstruments(instruments: any[], column: SortColumn, direction: SortDirection): any[] {
    return [...instruments].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (column) {
        case 'name':
          aVal = a.shortName?.toLowerCase() || '';
          bVal = b.shortName?.toLowerCase() || '';
          break;
        case 'lastPrice':
          aVal = a.lastPrice;
          bVal = b.lastPrice;
          break;
        case 'volumeMoney':
          aVal = a.volumeMoney;
          bVal = b.volumeMoney;
          break;
        case 'pctDay':
          aVal = a.pctDay;
          bVal = b.pctDay;
          break;
        case 'pct30D':
          aVal = a.pct30D;
          bVal = b.pct30D;
          break;
        case 'pctCY':
          aVal = a.pctCY;
          bVal = b.pctCY;
          break;
        case 'pct1Y':
          aVal = a.pct1Y;
          bVal = b.pct1Y;
          break;
        default:
          return 0;
      }

      // Handle undefined values - they go to the end
      if (aVal === undefined && bVal === undefined) return 0;
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      // Normal comparison
      let result = 0;
      if (typeof aVal === 'string') {
        result = aVal.localeCompare(bVal);
      } else {
        result = aVal - bVal;
      }

      return direction === 'asc' ? result : -result;
    });
  }

  trackByInstrument(index: number, instrument: any): any {
    return instrument.codeInstrument || index;
  }
}
