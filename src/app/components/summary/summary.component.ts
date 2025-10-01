import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  @Input() summary: any = null;
  
  activeTab: 'resumen' | 'detalles' = 'resumen';

  setActiveTab(tab: 'resumen' | 'detalles'): void {
    this.activeTab = tab;
  }
}
