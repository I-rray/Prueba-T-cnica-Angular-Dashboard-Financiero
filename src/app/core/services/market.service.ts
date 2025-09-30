import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el JSON de constituyentes desde assets
   */
  getConstituents(): Observable<any> {
    return this.http.get('assets/json-angular/constituyentes/constituensList.json');
  }

  /**
   * Obtiene el resumen de un símbolo específico desde assets
   */
  getSummary(symbol: string): Observable<any> {
    return this.http.get(`assets/json-angular/resumen/${symbol}.json`);
  }

  /**
   * Obtiene el histórico de un símbolo específico desde assets
   */
  getHistory(symbol: string): Observable<any> {
    return this.http.get(`assets/json-angular/history/history-${symbol}.json`);
  }
}