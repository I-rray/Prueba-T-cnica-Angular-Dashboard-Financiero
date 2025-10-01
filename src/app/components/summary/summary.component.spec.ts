import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  const mockInstrument = {
    codeInstrument: 'BCI',
    name: 'Banco de Chile',
    shortName: 'BCI',
    lastPrice: 25000,
    datetimeLastPrice: '2024-01-15 16:30:00',
    pctDay: 2.04,
    pct30D: 5.5,
    pctCY: 12.3,
    pct1Y: 18.7,
    volumeMoney: 1500000
  };

  const mockHistory = [
    { datetimeLastPrice: '2024-01-15 16:30:00', lastPrice: 25000 },
    { datetimeLastPrice: '2024-01-15 10:00:00', lastPrice: 24800 },
    { datetimeLastPrice: '2024-01-14 16:00:00', lastPrice: 24500 }
  ];

  const mockSummaryNegativePerformance = {
    price: {
      lastPrice: 24000,
      pctDay: -1.32
    }
  };

  const mockSummaryZeroPerformance = {
    price: {
      lastPrice: 25000,
      pctDay: 0
    }
  };

  const mockSummaryPartialData = {
    info: {
      symbol: 'TEST',
      name: 'Test Instrument',
      marketName: 'Test Market'
    },
    price: {
      lastPrice: 100,
      pctDay: 1.5
    },
    perf: {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('With valid instrument data', () => {
    beforeEach(() => {
      component.instrument = mockInstrument;
      component.history = mockHistory;
      fixture.detectChanges();
    });

    it('should display instrument symbol and name', () => {
      const symbolElement = fixture.debugElement.query(By.css('.symbol'));
      const nameElement = fixture.debugElement.query(By.css('.name'));
      
      expect(symbolElement.nativeElement.textContent.trim()).toBe('BCI');
      expect(nameElement.nativeElement.textContent.trim()).toBe('Banco de Chile');
    });

    it('should display last price', () => {
      const priceElement = fixture.debugElement.query(By.css('.price-value'));
      expect(priceElement.nativeElement.textContent).toContain('25,000.00');
    });

    it('should display price timestamp', () => {
      const timestampElement = fixture.debugElement.query(By.css('.price-timestamp'));
      expect(timestampElement.nativeElement.textContent.trim()).toBe('2024-01-15 16:30:00');
    });

    it('should show variation bands', () => {
      const variationLabels = fixture.debugElement.queryAll(By.css('.variation-label'));
      const labelTexts = variationLabels.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Día');
      expect(labelTexts).toContain('30D');
      expect(labelTexts).toContain('YTD');
      expect(labelTexts).toContain('1A');
    });

    it('should show basic info in resumen tab', () => {
      const kvRows = fixture.debugElement.queryAll(By.css('.additional-info .kv-row .k'));
      const labelTexts = kvRows.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Sector');
      expect(labelTexts).toContain('Moneda');
      expect(labelTexts).toContain('País');
    });

    it('should switch to detalles tab', () => {
      const detallesButton = fixture.debugElement.query(By.css('.tab-button:nth-child(2)'));
      detallesButton.nativeElement.click();
      fixture.detectChanges();

      const detailsTable = fixture.debugElement.query(By.css('.details-table'));
      expect(detailsTable).toBeTruthy();
    });

    it('should show market info in detalles tab', () => {
      component.setActiveTab('detalles');
      fixture.detectChanges();

      const kvRows = fixture.debugElement.queryAll(By.css('.details-table .kv-row .k'));
      const labelTexts = kvRows.map(label => label.nativeElement.textContent.trim());
      
      expect(labelTexts).toContain('Mercado');
      expect(labelTexts).toContain('Apertura');
      expect(labelTexts).toContain('Cierre anterior');
    });
  });

  describe('Performance color coding', () => {
    it('should apply positive color class for positive performance', () => {
      component.instrument = { ...mockInstrument, pctDay: 2.5 };
      fixture.detectChanges();

      const positiveElements = fixture.debugElement.queryAll(By.css('.pos'));
      expect(positiveElements.length).toBeGreaterThan(0);
    });

    it('should apply negative color class for negative performance', () => {
      component.instrument = { ...mockInstrument, pctDay: -1.5 };
      fixture.detectChanges();

      const negativeElements = fixture.debugElement.queryAll(By.css('.neg'));
      expect(negativeElements.length).toBeGreaterThan(0);
    });

    it('should apply neutral color class for zero performance', () => {
      component.instrument = { ...mockInstrument, pctDay: 0 };
      fixture.detectChanges();

      const neutralElements = fixture.debugElement.queryAll(By.css('.neu'));
      expect(neutralElements.length).toBeGreaterThan(0);
    });
  });

  describe('Null instrument state', () => {
    beforeEach(() => {
      component.instrument = null;
      fixture.detectChanges();
    });

    it('should show no summary template', () => {
      const noSummaryElement = fixture.debugElement.query(By.css('.no-summary'));
      expect(noSummaryElement).toBeTruthy();
    });

    it('should display no data message', () => {
      const titleElement = fixture.debugElement.query(By.css('.no-summary-title'));
      expect(titleElement.nativeElement.textContent).toContain('No hay datos de resumen');
    });

    it('should show info icon in placeholder', () => {
      const iconElement = fixture.debugElement.query(By.css('.no-summary-icon'));
      expect(iconElement).toBeTruthy();
    });
  });

  describe('Undefined instrument state', () => {
    beforeEach(() => {
      component.instrument = undefined;
      fixture.detectChanges();
    });

    it('should show no summary template', () => {
      const noSummaryElement = fixture.debugElement.query(By.css('.no-summary'));
      expect(noSummaryElement).toBeTruthy();
    });
  });

  describe('Empty instrument data state', () => {
    beforeEach(() => {
      component.instrument = {};
      fixture.detectChanges();
    });

    it('should handle empty data gracefully', () => {
      expect(component).toBeTruthy();
      // Component should not crash with empty data
    });
  });

  describe('Tab functionality', () => {
    beforeEach(() => {
      component.instrument = mockInstrument;
      fixture.detectChanges();
    });

    it('should display tab buttons', () => {
      const tabButtons = fixture.debugElement.queryAll(By.css('.tab-button'));
      const buttonTexts = tabButtons.map(button => button.nativeElement.textContent.trim());
      
      expect(buttonTexts).toContain('Resumen');
      expect(buttonTexts).toContain('Detalles');
    });

    it('should have resumen tab active by default', () => {
      const activeTab = fixture.debugElement.query(By.css('.tab-button.active'));
      expect(activeTab.nativeElement.textContent.trim()).toBe('Resumen');
    });

    it('should switch to detalles tab when clicked', () => {
      const detallesButton = fixture.debugElement.query(By.css('.tab-button:nth-child(2)'));
      detallesButton.nativeElement.click();
      fixture.detectChanges();

      const activeTab = fixture.debugElement.query(By.css('.tab-button.active'));
      expect(activeTab.nativeElement.textContent.trim()).toBe('Detalles');
    });
  });

  describe('Formatting methods', () => {
    it('should format numbers correctly', () => {
      expect(component.fmt2(25000)).toBe('25,000.00');
      expect(component.fmt2(undefined)).toBe('—');
    });

    it('should format integers correctly', () => {
      expect(component.fmtInt(1500000)).toBe('1,500,000');
      expect(component.fmtInt(undefined)).toBe('—');
    });

    it('should format percentages correctly', () => {
      expect(component.fmtPct(2.5)).toBe('+2.50%');
      expect(component.fmtPct(-1.5)).toBe('-1.50%');
      expect(component.fmtPct(0)).toBe('0.00%');
      expect(component.fmtPct(undefined)).toBe('—');
    });

    it('should return correct CSS classes for performance', () => {
      expect(component.pctClass(2.5)).toBe('pos');
      expect(component.pctClass(-1.5)).toBe('neg');
      expect(component.pctClass(0)).toBe('neu');
      expect(component.pctClass(undefined)).toBe('neu');
    });
  });
});
