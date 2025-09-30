import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-instrument-item',
  imports: [],
  templateUrl: './instrument-item.component.html',
  styleUrl: './instrument-item.component.scss'
})
export class InstrumentItemComponent {

  @Input() instrument: any = null;
  @Input() isSelected: boolean = false;
  @Output() clicked = new EventEmitter<any>();

  onItemClick(): void {
    this.clicked.emit(this.instrument);
  }
}
