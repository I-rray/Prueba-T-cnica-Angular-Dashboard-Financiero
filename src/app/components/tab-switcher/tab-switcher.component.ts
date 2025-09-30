import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-switcher',
  imports: [CommonModule],
  templateUrl: './tab-switcher.component.html',
  styleUrl: './tab-switcher.component.scss'
})
export class TabSwitcherComponent {

  @Input() indices: string[] = ['IPSA'];
  @Input() selectedIndex: string = 'IPSA';
  @Output() indexChange = new EventEmitter<string>();

  onTabClick(indexId: string): void {
    this.indexChange.emit(indexId);
  }
}
