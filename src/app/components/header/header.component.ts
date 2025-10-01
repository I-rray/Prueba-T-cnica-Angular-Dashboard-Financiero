import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input() instrument: any = null;
  @Input() indexTitle: string = '';

  /**
   * Helper para formatear números con signo
   */
  signed(v: number): string {
    if (!this.isNumber(v)) return '';
    return v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2);
  }

  /**
   * Helper para obtener la clase CSS según el valor
   */
  signClass(v: number): string {
    if (!this.isNumber(v)) return 'neu';
    if (v > 0) return 'pos';
    if (v < 0) return 'neg';
    return 'neu';
  }

  /**
   * Helper para verificar si un valor es un número válido
   */
  isNumber(v: any): boolean {
    return typeof v === 'number' && !isNaN(v);
  }
}
