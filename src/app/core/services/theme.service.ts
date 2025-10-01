import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'market-dashboard-theme';
  
  // Signal para el tema actual
  private _currentTheme = signal<Theme>(this.getInitialTheme());
  
  // Getter público para el tema actual
  get currentTheme() {
    return this._currentTheme.asReadonly();
  }

  constructor() {
    // Aplicar el tema inicial
    this.applyTheme(this._currentTheme());
  }

  /**
   * Cambia entre modo claro y oscuro
   */
  toggleTheme(): void {
    const newTheme: Theme = this._currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Establece un tema específico
   */
  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  /**
   * Obtiene el tema inicial desde localStorage o usa 'dark' por defecto
   */
  private getInitialTheme(): Theme {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    }
    return 'dark'; // Tema por defecto
  }

  /**
   * Aplica el tema al documento
   */
  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      
      // También agregar/remover clase para compatibilidad
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }

  /**
   * Guarda el tema en localStorage
   */
  private saveTheme(theme: Theme): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }
}