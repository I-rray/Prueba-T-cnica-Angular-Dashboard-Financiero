import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InstrumentItemComponent } from '../instrument-item/instrument-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instrument-list',
  imports: [InstrumentItemComponent, CommonModule],
  templateUrl: './instrument-list.component.html',
  styleUrl: './instrument-list.component.scss'
})
export class InstrumentListComponent {

  @Input() instruments: any[] = [];
  @Input() selectedInstrument: any = null;
  @Output() select = new EventEmitter<any>();

  onInstrumentClicked(instrument: any): void {
    this.select.emit(instrument);
  }

  trackByInstrument(index: number, instrument: any): any {
    return instrument.codeInstrument || index;
  }
}
