import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  const mockSummaryData = {
    data: {
      price: {
        lastPrice: 25000,
        openPrice: 24500,
        closePrice: 24800,
        maxDay: 25200,
        minDay: 24300,
        performanceRelative: 2.04,
        min52W: 20000,
        max52W: 28000,
        volumeMoney: 1500000000,
        accumulatedVolumeMoney: 45000000000
      },
      info: {
        marketName: 'Bolsa de Santiago',
        currencyName: 'CLP',
        hourOpen: '09:30',
        hourClose: '16:00'
      }
    }
  };

  const mockSummaryNegativePerformance = {
    data: {
      price: {
        lastPrice: 24000,
        openPrice: 25000,
        closePrice: 24800,
        maxDay: 25200,
        minDay: 23800,
        performanceRelative: -1.32,
        min52W: 20000,
        max52W: 28000,
        volumeMoney: 800000000,
        accumulatedVolumeMoney: 24000000000
      },
      info: {
        marketName: 'Bolsa de Santiago',
        currencyName: 'CLP',
        hourOpen: '09:30',
        hourClose: '16:00'
      }
    }
  };

  const mockSummaryZeroPerformance = {
    data: {
      price: {
        lastPrice: 25000,
        openPrice: 25000,
        closePrice: 25000,
        maxDay: 25100,
        minDay: 24900,
        performanceRelative: 0,
        min52W: 20000,
        max52W: 28000,
        volumeMoney: 1000000000,
        accumulatedVolumeMoney: 30000000000
      },
      info: {
        marketName: 'Bolsa de Santiago',
        currencyName: 'CLP',
        hourOpen: '09:30',
        hourClose: '16:00'
      }
    }
  };

  const mockSummaryPartialData = {
    data: {
      price: {
        lastPrice: 25000,
        openPrice: 24500,
        closePrice: 24800
        // Missing other price fields
      },
      info: {
        marketName: 'Bolsa de Santiago',
        currencyName: 'CLP'
        // Missing hour fields
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('With complete summary data', () => {
    beforeEach(() => {
      component.summary = mockSummaryData;
      fixture.detectChanges();
    });

    it('should display summary title', () => {
      const titleElement = fixture.debugElement.query(By.css('h3.text-xl'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Resumen Detallado');
    });

    it('should show key price fields', () => {
      const priceLabels = fixture.debugElement.queryAll(By.css('.text-600.font-medium'));
      const labelTexts = priceLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Precio Actual');
      expect(labelTexts).toContain('Precio Apertura');
      expect(labelTexts).toContain('Precio Cierre');
      expect(labelTexts).toContain('Máximo del Día');
      expect(labelTexts).toContain('Mínimo del Día');
      expect(labelTexts).toContain('Variación Diaria');
    });

    it('should display current price correctly', () => {
      const currentPriceElement = fixture.debugElement.query(By.css('.font-bold.text-900'));
      expect(currentPriceElement.nativeElement.textContent).toContain('25,000.00');
    });

    it('should display open price correctly', () => {
      const priceElements = fixture.debugElement.queryAll(By.css('.font-semibold.text-700'));
      const openPriceElement = priceElements.find(el => 
        el.nativeElement.textContent.includes('24,500.00')
      );
      expect(openPriceElement).toBeTruthy();
    });

    it('should display close price correctly', () => {
      const priceElements = fixture.debugElement.queryAll(By.css('.font-semibold.text-700'));
      const closePriceElement = priceElements.find(el => 
        el.nativeElement.textContent.includes('24,800.00')
      );
      expect(closePriceElement).toBeTruthy();
    });

    it('should show 52-week range fields', () => {
      const rangeLabels = fixture.debugElement.queryAll(By.css('.text-600.font-medium'));
      const labelTexts = rangeLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Mínimo 52S');
      expect(labelTexts).toContain('Máximo 52S');
    });

    it('should display 52-week high and low correctly', () => {
      const priceElements = fixture.debugElement.queryAll(By.css('.font-semibold.text-700'));
      const min52WElement = priceElements.find(el => 
        el.nativeElement.textContent.includes('20,000.00')
      );
      const max52WElement = priceElements.find(el => 
        el.nativeElement.textContent.includes('28,000.00')
      );
      
      expect(min52WElement).toBeTruthy();
      expect(max52WElement).toBeTruthy();
    });

    it('should show volume information fields', () => {
      const volumeLabels = fixture.debugElement.queryAll(By.css('.text-600.font-medium'));
      const labelTexts = volumeLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Volumen Diario');
      expect(labelTexts).toContain('Volumen Acumulado');
    });

    it('should show market information fields', () => {
      const marketLabels = fixture.debugElement.queryAll(By.css('.text-600.font-medium'));
      const labelTexts = marketLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Mercado');
      expect(labelTexts).toContain('Moneda');
      expect(labelTexts).toContain('Horario');
    });

    it('should display market name correctly', () => {
      const marketElements = fixture.debugElement.queryAll(By.css('.font-semibold.text-700'));
      const marketNameElement = marketElements.find(el => 
        el.nativeElement.textContent.includes('Bolsa de Santiago')
      );
      expect(marketNameElement).toBeTruthy();
    });

    it('should display currency correctly', () => {
      const currencyElements = fixture.debugElement.queryAll(By.css('.font-semibold.text-700'));
      const currencyElement = currencyElements.find(el => 
        el.nativeElement.textContent.includes('CLP')
      );
      expect(currencyElement).toBeTruthy();
    });

    it('should display trading hours correctly', () => {
      const hourElements = fixture.debugElement.queryAll(By.css('.font-semibold.text-700'));
      const hourElement = hourElements.find(el => 
        el.nativeElement.textContent.includes('09:30 - 16:00')
      );
      expect(hourElement).toBeTruthy();
    });

    it('should not show no-summary template when data exists', () => {
      const noSummaryElement = fixture.debugElement.query(By.css('.no-summary'));
      expect(noSummaryElement).toBeFalsy();
    });
  });

  describe('Performance color coding', () => {
    it('should apply green color for positive performance', () => {
      component.summary = mockSummaryData;
      fixture.detectChanges();
      
      const performanceElement = fixture.debugElement.query(By.css('.text-green-600'));
      expect(performanceElement).toBeTruthy();
      expect(performanceElement.nativeElement.textContent).toContain('+2.04%');
    });

    it('should apply red color for negative performance', () => {
      component.summary = mockSummaryNegativePerformance;
      fixture.detectChanges();
      
      const performanceElement = fixture.debugElement.query(By.css('.text-red-600'));
      expect(performanceElement).toBeTruthy();
      expect(performanceElement.nativeElement.textContent).toContain('-1.32%');
    });

    it('should apply neutral color for zero performance', () => {
      component.summary = mockSummaryZeroPerformance;
      fixture.detectChanges();
      
      // Find the performance element by looking for the span with performance data
      const performanceElements = fixture.debugElement.queryAll(By.css('span'));
      const performanceElement = performanceElements.find(el => 
        el.nativeElement.textContent.includes('0.00%')
      );
      
      expect(performanceElement).toBeTruthy();
      if (performanceElement) {
        expect(performanceElement.nativeElement.textContent).toContain('0.00%');
        expect(performanceElement.nativeElement.textContent).not.toContain('+');
        expect(performanceElement.nativeElement.classList).toContain('text-600');
      }
    });

    it('should show plus sign for positive performance', () => {
      component.summary = mockSummaryData;
      fixture.detectChanges();
      
      const performanceElement = fixture.debugElement.query(By.css('.text-green-600'));
      expect(performanceElement.nativeElement.textContent).toContain('+');
    });

    it('should not show plus sign for negative performance', () => {
      component.summary = mockSummaryNegativePerformance;
      fixture.detectChanges();
      
      const performanceElement = fixture.debugElement.query(By.css('.text-red-600'));
      expect(performanceElement.nativeElement.textContent).not.toContain('+');
    });
  });

  describe('Null summary state', () => {
    beforeEach(() => {
      component.summary = null;
      fixture.detectChanges();
    });

    it('should show no-summary template when summary is null', () => {
      const noSummaryElement = fixture.debugElement.query(By.css('.no-summary'));
      expect(noSummaryElement).toBeTruthy();
    });

    it('should display placeholder message', () => {
      const titleElement = fixture.debugElement.query(By.css('h3.text-xl.text-500'));
      const descriptionElement = fixture.debugElement.query(By.css('p.text-sm.text-400'));
      
      expect(titleElement.nativeElement.textContent.trim()).toBe('No hay datos de resumen');
      expect(descriptionElement.nativeElement.textContent.trim()).toBe('Selecciona un instrumento para ver su información detallada');
    });

    it('should show info icon in placeholder', () => {
      const iconElement = fixture.debugElement.query(By.css('i.pi-info-circle'));
      expect(iconElement).toBeTruthy();
    });

    it('should not show summary content when null', () => {
      const summaryContentElement = fixture.debugElement.query(By.css('.summary-content'));
      expect(summaryContentElement).toBeFalsy();
    });
  });

  describe('Undefined summary state', () => {
    beforeEach(() => {
      component.summary = undefined;
      fixture.detectChanges();
    });

    it('should show no-summary template when summary is undefined', () => {
      const noSummaryElement = fixture.debugElement.query(By.css('.no-summary'));
      expect(noSummaryElement).toBeTruthy();
    });
  });

  describe('Empty summary data state', () => {
    beforeEach(() => {
      component.summary = { data: null };
      fixture.detectChanges();
    });

    it('should show no-summary template when summary.data is null', () => {
      const noSummaryElement = fixture.debugElement.query(By.css('.no-summary'));
      expect(noSummaryElement).toBeTruthy();
    });
  });

  describe('Partial data handling', () => {
    beforeEach(() => {
      component.summary = mockSummaryPartialData;
      fixture.detectChanges();
    });

    it('should show available price fields', () => {
      const priceLabels = fixture.debugElement.queryAll(By.css('.text-600.font-medium'));
      const labelTexts = priceLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Precio Actual');
      expect(labelTexts).toContain('Precio Apertura');
      expect(labelTexts).toContain('Precio Cierre');
    });

    it('should not show 52-week range when data is missing', () => {
      const rangeLabels = fixture.debugElement.queryAll(By.css('.text-600.font-medium'));
      const labelTexts = rangeLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).not.toContain('Mínimo 52S');
      expect(labelTexts).not.toContain('Máximo 52S');
    });

    it('should not show volume information when data is missing', () => {
      const volumeLabels = fixture.debugElement.queryAll(By.css('.text-600.font-medium'));
      const labelTexts = volumeLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).not.toContain('Volumen Diario');
      expect(labelTexts).not.toContain('Volumen Acumulado');
    });

    it('should show available market info fields', () => {
      component.summary = mockSummaryPartialData;
      fixture.detectChanges();
      
      const marketLabels = fixture.debugElement.queryAll(By.css('.text-600.font-medium'));
      const labelTexts = marketLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Mercado');
      expect(labelTexts).toContain('Moneda');
      expect(labelTexts).not.toContain('Horario'); // Missing hour fields
    });
  });

  describe('Section headers', () => {
    beforeEach(() => {
      component.summary = mockSummaryData;
      fixture.detectChanges();
    });

    it('should display all section headers', () => {
      const sectionHeaders = fixture.debugElement.queryAll(By.css('h4.text-lg.font-medium'));
      const headerTexts = sectionHeaders.map(header => header.nativeElement.textContent.trim());
      
      expect(headerTexts).toContain('Información de Precios');
      expect(headerTexts).toContain('Rango 52 Semanas');
      expect(headerTexts).toContain('Información de Volumen');
      expect(headerTexts).toContain('Información del Mercado');
    });
  });
});
