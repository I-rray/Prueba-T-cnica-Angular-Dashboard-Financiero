import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene constituyentes específicos por índice
   * Intenta cargar archivo específico, si no existe lanza error para usar fallback
   */
  getConstituentsByIndex(indexId: string): Observable<any> {
    let fileName: string;
    
    switch (indexId) {
      case 'IPSA':
        fileName = 'constituyentes/constituensList.json';
        break;
      case 'IGPA':
        fileName = 'constituyentes/IGPA-constituents.json';
        break;
      case 'NASDAQ':
        fileName = 'constituyentes/NASDAQ-constituents.json';
        break;
      case 'DOW JONES':
        fileName = 'constituyentes/DOW-constituents.json';
        break;
      case 'SP/BVL':
        fileName = 'constituyentes/SPBVL-constituents.json';
        break;
      default:
        fileName = 'constituyentes/constituensList.json';
    }
    
    return this.http.get<any>(`assets/json-angular/${fileName}`);
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