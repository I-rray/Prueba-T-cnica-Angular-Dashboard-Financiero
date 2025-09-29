import { Component } from '@angular/core';
import { InstrumentItemComponent } from '../instrument-item/instrument-item.component';

@Component({
  selector: 'app-instrument-list',
  imports: [InstrumentItemComponent],
  templateUrl: './instrument-list.component.html',
  styleUrl: './instrument-list.component.scss'
})
export class InstrumentListComponent {

}
