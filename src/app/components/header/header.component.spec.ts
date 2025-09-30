import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const mockInstrumentPositive = {
    symbol: 'BCI',
    shortName: 'BCI',
    name: 'Banco de Chile',
    lastPrice: 25000,
    datetimeLastPrice: '2024-01-15 16:30:00',
    pctDay: 2.04,
    pct30D: 5.67,
    pctCY: 12.34,
    pct1Y: 18.90,
    volumeMoney: 1500000000,
    accumulatedVolumeMoney: 45000000000
  };

  const mockInstrumentNegative = {
    symbol: 'COPEC',
    shortName: 'COPEC',
    name: 'Empresas Copec S.A.',
    lastPrice: 7500,
    datetimeLastPrice: '2024-01-15 16:30:00',
    pctDay: -1.32,
    pct30D: -3.45,
    pctCY: -8.76,
    pct1Y: -15.20,
    volumeMoney: 800000000,
    accumulatedVolumeMoney: 24000000000
  };

  const mockInstrumentZero = {
    symbol: 'NEUTRAL',
    shortName: 'NEUTRAL',
    name: 'Neutral Stock',
    lastPrice: 5000,
    datetimeLastPrice: '2024-01-15 16:30:00',
    pctDay: 0,
    pct30D: 0,
    pctCY: 0,
    pct1Y: 0,
    volumeMoney: 1000000000,
    accumulatedVolumeMoney: 30000000000
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('With instrument data', () => {
    beforeEach(() => {
      component.instrument = mockInstrumentPositive;
      fixture.detectChanges();
    });

    it('should display instrument symbol and name', () => {
      const symbolElement = fixture.debugElement.query(By.css('h1'));
      const nameElement = fixture.debugElement.query(By.css('p.text-lg'));
      
      expect(symbolElement.nativeElement.textContent.trim()).toBe('BCI');
      expect(nameElement.nativeElement.textContent.trim()).toBe('Banco de Chile');
    });

    it('should display last price', () => {
      const priceElement = fixture.debugElement.query(By.css('.text-4xl.font-bold'));
      expect(priceElement.nativeElement.textContent).toContain('25,000.00');
    });

    it('should display datetime of last price', () => {
      const datetimeElement = fixture.debugElement.query(By.css('.text-sm.text-500'));
      expect(datetimeElement.nativeElement.textContent.trim()).toBe('2024-01-15 16:30:00');
    });

    it('should not show no-instrument template when instrument exists', () => {
      const noInstrumentElement = fixture.debugElement.query(By.css('.no-instrument'));
      expect(noInstrumentElement).toBeFalsy();
    });
  });

  describe('Semantic color application for positive values', () => {
    beforeEach(() => {
      component.instrument = mockInstrumentPositive;
      fixture.detectChanges();
    });

    it('should apply green color for positive daily variation', () => {
      const dayElement = fixture.debugElement.query(By.css('.font-semibold'));
      expect(dayElement.nativeElement.classList).toContain('text-green-600');
      expect(dayElement.nativeElement.textContent).toContain('+2.04%');
    });

    it('should apply green color for all positive performance indicators', () => {
      const performanceElements = fixture.debugElement.queryAll(By.css('.font-semibold'));
      
      performanceElements.forEach(element => {
        expect(element.nativeElement.classList).toContain('text-green-600');
      });
    });
  });

  describe('Semantic color application for negative values', () => {
    beforeEach(() => {
      component.instrument = mockInstrumentNegative;
      fixture.detectChanges();
    });

    it('should apply red color for negative daily variation', () => {
      const dayElement = fixture.debugElement.query(By.css('.font-semibold'));
      expect(dayElement.nativeElement.classList).toContain('text-red-600');
      expect(dayElement.nativeElement.textContent).toContain('-1.32%');
    });

    it('should apply red color for all negative performance indicators', () => {
      const performanceElements = fixture.debugElement.queryAll(By.css('.font-semibold'));
      
      performanceElements.forEach(element => {
        expect(element.nativeElement.classList).toContain('text-red-600');
      });
    });
  });

  describe('Semantic color application for zero values', () => {
    beforeEach(() => {
      component.instrument = mockInstrumentZero;
      fixture.detectChanges();
    });

    it('should apply neutral color for zero variations', () => {
      const performanceElements = fixture.debugElement.queryAll(By.css('.font-semibold'));
      
      performanceElements.forEach(element => {
        expect(element.nativeElement.classList).toContain('text-600');
      });
    });
  });

  describe('Performance indicators display', () => {
    beforeEach(() => {
      component.instrument = mockInstrumentPositive;
      fixture.detectChanges();
    });

    it('should display all performance periods with correct labels', () => {
      const labels = fixture.debugElement.queryAll(By.css('.text-sm.text-500'));
      const labelTexts = labels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Día');
      expect(labelTexts).toContain('30D');
      expect(labelTexts).toContain('YTD');
      expect(labelTexts).toContain('1A');
    });

    it('should show plus sign for positive values', () => {
      const performanceElements = fixture.debugElement.queryAll(By.css('.font-semibold'));
      
      performanceElements.forEach(element => {
        expect(element.nativeElement.textContent).toContain('+');
      });
    });
  });

  describe('Volume information display', () => {
    beforeEach(() => {
      component.instrument = mockInstrumentPositive;
      fixture.detectChanges();
    });

    it('should display daily volume', () => {
      const volumeLabels = fixture.debugElement.queryAll(By.css('.text-sm.text-500'));
      const volumeLabelTexts = volumeLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(volumeLabelTexts).toContain('Volumen Diario');
    });

    it('should display accumulated volume', () => {
      const volumeLabels = fixture.debugElement.queryAll(By.css('.text-sm.text-500'));
      const volumeLabelTexts = volumeLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(volumeLabelTexts).toContain('Volumen Acumulado');
    });

    it('should format volume numbers correctly', () => {
      const volumeValues = fixture.debugElement.queryAll(By.css('.font-medium.text-900'));
      
      expect(volumeValues.length).toBeGreaterThan(0);
      volumeValues.forEach(value => {
        expect(value.nativeElement.textContent).toContain('$');
      });
    });
  });

  describe('No instrument state', () => {
    beforeEach(() => {
      component.instrument = null;
      fixture.detectChanges();
    });

    it('should show no-instrument template when instrument is null', () => {
      const noInstrumentElement = fixture.debugElement.query(By.css('.no-instrument'));
      expect(noInstrumentElement).toBeTruthy();
    });

    it('should display placeholder message', () => {
      const titleElement = fixture.debugElement.query(By.css('h3'));
      const descriptionElement = fixture.debugElement.query(By.css('p.text-sm'));
      
      expect(titleElement.nativeElement.textContent.trim()).toBe('Selecciona un instrumento');
      expect(descriptionElement.nativeElement.textContent.trim()).toBe('Elige un instrumento de la lista para ver su información detallada');
    });

    it('should show chart icon in placeholder', () => {
      const iconElement = fixture.debugElement.query(By.css('i.pi-chart-line'));
      expect(iconElement).toBeTruthy();
    });

    it('should not show instrument data when null', () => {
      const instrumentHeaderElement = fixture.debugElement.query(By.css('.instrument-header'));
      expect(instrumentHeaderElement).toBeFalsy();
    });
  });

  describe('Conditional rendering', () => {
    it('should handle missing performance data gracefully', () => {
      const instrumentWithMissingData = {
        symbol: 'TEST',
        shortName: 'TEST',
        name: 'Test Instrument',
        lastPrice: 1000,
        datetimeLastPrice: '2024-01-15 16:30:00'
        // Missing pctDay, pct30D, etc.
      };

      component.instrument = instrumentWithMissingData;
      fixture.detectChanges();

      const performanceElements = fixture.debugElement.queryAll(By.css('.font-semibold'));
      expect(performanceElements.length).toBe(0); // No performance indicators should be shown
    });

    it('should handle missing volume data gracefully', () => {
      const instrumentWithoutVolume = {
        symbol: 'TEST',
        shortName: 'TEST',
        name: 'Test Instrument',
        lastPrice: 1000,
        datetimeLastPrice: '2024-01-15 16:30:00',
        pctDay: 1.5
        // Missing volumeMoney and accumulatedVolumeMoney
      };

      component.instrument = instrumentWithoutVolume;
      fixture.detectChanges();

      const volumeSection = fixture.debugElement.query(By.css('.border-top-1'));
      expect(volumeSection).toBeFalsy(); // Volume section should not be shown
    });
  });
});
