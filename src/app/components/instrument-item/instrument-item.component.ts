import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instrument-item',
  imports: [CommonModule],
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
