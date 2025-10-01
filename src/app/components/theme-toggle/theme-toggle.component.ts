import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="theme-toggle-btn"
      (click)="toggleTheme()"
      [attr.aria-label]="currentTheme() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      title="{{ currentTheme() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro' }}">
      
      <div class="icon-container" [class.rotate]="isToggling">
        @if (currentTheme() === 'dark') {
          <svg class="icon sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        } @else {
          <svg class="icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        }
      </div>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem;
      border: 1px solid var(--border-color, #374151);
      border-radius: 50%;
      background: var(--bg-secondary, #374151);
      color: var(--text-primary, #f3f4f6);
      cursor: pointer;
      transition: all 0.2s ease;
      width: 44px;
      height: 44px;

      &:hover {
        background: var(--bg-hover, #4b5563);
        border-color: var(--border-hover, #6b7280);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      &:active {
        transform: translateY(0);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
      }
    }

    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;

      &.rotate {
        transform: rotate(180deg);
      }
    }

    .icon {
      width: 20px;
      height: 20px;
      stroke-width: 2;
      transition: all 0.2s ease;
    }

    .sun-icon {
      color: #fbbf24;
    }

    .moon-icon {
      color: #60a5fa;
    }

    /* Estilos para modo claro */
    :host-context([data-theme="light"]) .theme-toggle-btn {
      --bg-secondary: #ffffff;
      --bg-hover: #f3f4f6;
      --text-primary: #374151;
      --border-color: #d1d5db;
      --border-hover: #9ca3af;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .theme-toggle-btn {
        width: 40px;
        height: 40px;
        padding: 0.625rem;
      }

      .icon {
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  
  currentTheme = this.themeService.currentTheme;
  isToggling = false;

  toggleTheme(): void {
    this.isToggling = true;
    this.themeService.toggleTheme();
    
    // Reset animation after a short delay
    setTimeout(() => {
      this.isToggling = false;
    }, 300);
  }
}