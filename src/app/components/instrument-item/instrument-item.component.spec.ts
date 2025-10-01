import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InstrumentItemComponent } from './instrument-item.component';

describe('InstrumentItemComponent', () => {
  let component: InstrumentItemComponent;
  let fixture: ComponentFixture<InstrumentItemComponent>;

  const mockInstrument = {
    shortName: 'Test Instrument',
    name: 'Test Instrument Full Name',
    codeInstrument: 'TEST',
    lastPrice: 100.50,
    pctDay: 2.5,
    pct30D: -1.2,
    pctYTD: 5.8,
    pct12M: 10.3
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display instrument name and symbol', () => {
    component.instrument = mockInstrument;
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('.font-medium.text-900'));
    const symbolElement = fixture.debugElement.query(By.css('.text-sm.text-500'));

    expect(nameElement.nativeElement.textContent.trim()).toBe('Test Instrument');
    expect(symbolElement.nativeElement.textContent.trim()).toBe('TEST');
  });

  it('should display last price', () => {
    component.instrument = mockInstrument;
    fixture.detectChanges();

    const priceElements = fixture.debugElement.queryAll(By.css('.font-medium'));
    const priceElement = priceElements.find(el => 
      el.nativeElement.textContent.includes('100.50')
    );

    expect(priceElement).toBeTruthy();
    if (priceElement) {
      expect(priceElement.nativeElement.textContent.trim()).toBe('100.50');
    }
  });

  it('should emit click event when clicked', () => {
    component.instrument = mockInstrument;
    spyOn(component.clicked, 'emit');

    const itemElement = fixture.debugElement.query(By.css('.instrument-item-row'));
    itemElement.nativeElement.click();

    expect(component.clicked.emit).toHaveBeenCalledWith(mockInstrument);
  });

  it('should apply correct color class for positive performance', () => {
    component.instrument = { ...mockInstrument, pctDay: 2.5 };
    fixture.detectChanges();

    const performanceElements = fixture.debugElement.queryAll(By.css('.text-green-600'));
    expect(performanceElements.length).toBeGreaterThan(0);
  });

  it('should apply correct color class for negative performance', () => {
    component.instrument = { ...mockInstrument, pct30D: -1.2 };
    fixture.detectChanges();

    const performanceElements = fixture.debugElement.queryAll(By.css('.text-red-600'));
    expect(performanceElements.length).toBeGreaterThan(0);
  });

  it('should handle zero performance', () => {
    component.instrument = { ...mockInstrument, pctDay: 0 };
    fixture.detectChanges();

    const performanceElements = fixture.debugElement.queryAll(By.css('.text-600'));
    expect(performanceElements.length).toBeGreaterThan(0);
  });

  it('should handle null instrument', () => {
    component.instrument = null;
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('.font-medium.text-900'));
    expect(nameElement.nativeElement.textContent.trim()).toBe('N/A');
  });

  it('should display dash for missing values', () => {
    component.instrument = { shortName: 'Test', codeInstrument: 'TEST' };
    fixture.detectChanges();

    const dashElements = fixture.debugElement.queryAll(By.css('div'));
    const dashTexts = dashElements.map(el => el.nativeElement.textContent.trim());
    
    expect(dashTexts.some(text => text.includes('—'))).toBeTruthy();
  });
});
