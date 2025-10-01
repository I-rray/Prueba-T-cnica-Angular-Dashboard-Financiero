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
   * Solo IPSA tiene datos reales, otros índices generan datos simulados
   */
  getConstituentsByIndex(indexId: string): Observable<any> {
    if (indexId === 'IPSA') {
      // IPSA tiene datos reales
      return this.http.get<any>('assets/constituyentes/constituensList.json');
    } else {
      // Para otros índices, generar datos simulados basados en el índice
      return new Observable(observer => {
        const mockData = this.generateMockDataForIndex(indexId);
        observer.next(mockData);
        observer.complete();
      });
    }
  }

  /**
   * Genera datos mock para índices que no tienen archivos específicos
   */
  private generateMockDataForIndex(indexId: string): any {
    const baseData = {
      success: true,
      code: 200,
      data: {
        info: {
          name: indexId,
          shortName: indexId,
          countryName: this.getCountryForIndex(indexId),
          codeInstrument: indexId
        },
        constituents: this.getConstituentsForIndex(indexId)
      }
    };
    return baseData;
  }

  private getCountryForIndex(indexId: string): string {
    switch (indexId) {
      case 'IGPA': return 'Chile';
      case 'NASDAQ': return 'Estados Unidos';
      case 'DOW JONES': return 'Estados Unidos';
      case 'SP/BVL': return 'Perú';
      default: return 'Internacional';
    }
  }

  private getConstituentsForIndex(indexId: string): any[] {
    const baseInstruments = this.getInstrumentsForIndex(indexId);
    
    return baseInstruments.map((instrument, index) => ({
      codeInstrument: instrument.code,
      name: instrument.name,
      shortName: instrument.code,
      pctDay: (Math.random() - 0.5) * 6, // Variación entre -3% y +3%
      pct30D: (Math.random() - 0.5) * 20, // Variación entre -10% y +10%
      pctCY: (Math.random() - 0.5) * 60, // Variación entre -30% y +30%
      pct1Y: (Math.random() - 0.5) * 100, // Variación entre -50% y +50%
      lastPrice: Math.round((Math.random() * 500 + 50) * 100) / 100, // Precio entre 50 y 550
      datetimeLastPrice: new Date().toISOString().replace('T', ' ').substring(0, 19),
      volumeMoney: Math.floor(Math.random() * 10000000),
      accumulatedVolumeMoney: Math.floor(Math.random() * 1000000000),
      tend: Math.random() > 0.5 ? 'up' : (Math.random() > 0.5 ? 'down' : 'same'),
      performanceAbsolute: (Math.random() - 0.5) * 10,
      performanceRelative: (Math.random() - 0.5) * 5
    }));
  }

  private getInstrumentsForIndex(indexId: string): {code: string, name: string}[] {
    switch (indexId) {
      case 'IGPA':
        return [
          {code: 'AGUAS-A', name: 'AGUAS ANDINAS S.A., SERIE A'},
          {code: 'BCI', name: 'BANCO DE CREDITO E INVERSIONES'},
          {code: 'CHILE', name: 'BANCO DE CHILE'},
          {code: 'COPEC', name: 'EMPRESAS COPEC S.A.'},
          {code: 'FALABELLA', name: 'FALABELLA S.A.'},
          {code: 'LTM', name: 'LATAM AIRLINES GROUP S.A.'},
          {code: 'SQM-B', name: 'SOCIEDAD QUIMICA Y MINERA DE CHILE S.A.'}
        ];
      case 'NASDAQ':
        return [
          {code: 'AAPL', name: 'Apple Inc.'},
          {code: 'MSFT', name: 'Microsoft Corporation'},
          {code: 'GOOGL', name: 'Alphabet Inc.'},
          {code: 'AMZN', name: 'Amazon.com Inc.'},
          {code: 'TSLA', name: 'Tesla Inc.'},
          {code: 'META', name: 'Meta Platforms Inc.'},
          {code: 'NVDA', name: 'NVIDIA Corporation'}
        ];
      case 'DOW JONES':
        return [
          {code: 'AAPL', name: 'Apple Inc.'},
          {code: 'MSFT', name: 'Microsoft Corporation'},
          {code: 'JNJ', name: 'Johnson & Johnson'},
          {code: 'V', name: 'Visa Inc.'},
          {code: 'PG', name: 'Procter & Gamble Co.'},
          {code: 'JPM', name: 'JPMorgan Chase & Co.'},
          {code: 'HD', name: 'Home Depot Inc.'}
        ];
      case 'SP/BVL':
        return [
          {code: 'SCCO', name: 'Southern Copper Corporation'},
          {code: 'BVN', name: 'Compañía de Minas Buenaventura'},
          {code: 'CRZO', name: 'Carrizo Oil & Gas Inc.'},
          {code: 'BAP', name: 'Credicorp Ltd.'},
          {code: 'IFS', name: 'Intercorp Financial Services'},
          {code: 'CVERDEC1', name: 'Cementos Pacasmayo S.A.A.'}
        ];
      default:
        return [
          {code: 'DEFAULT1', name: 'Instrumento por Defecto 1'},
          {code: 'DEFAULT2', name: 'Instrumento por Defecto 2'}
        ];
    }
  }

  /**
   * Obtiene el resumen de un símbolo específico desde assets
   */
  getSummary(symbol: string): Observable<any> {
    return this.http.get(`assets/resumen/${symbol}.json`);
  }

  /**
   * Obtiene el histórico de un símbolo específico desde assets
   */
  getHistory(symbol: string): Observable<any> {
    return this.http.get(`assets/history/history-${symbol}.json`);
  }
}