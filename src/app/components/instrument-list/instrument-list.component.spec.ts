import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InstrumentListComponent } from './instrument-list.component';
import { InstrumentItemComponent } from '../instrument-item/instrument-item.component';

describe('InstrumentListComponent', () => {
  let component: InstrumentListComponent;
  let fixture: ComponentFixture<InstrumentListComponent>;

  const mockInstruments = [
    { 
      codeInstrument: 'BCI', 
      symbol: 'BCI', 
      name: 'Banco de Chile', 
      lastPrice: 25000, 
      dailyVariation: 500, 
      dailyVariationPercent: 2.04,
      volume: 1500000
    },
    { 
      codeInstrument: 'COPEC', 
      symbol: 'COPEC', 
      name: 'Empresas Copec', 
      lastPrice: 7500, 
      dailyVariation: -100, 
      dailyVariationPercent: -1.32,
      volume: 800000
    },
    { 
      codeInstrument: 'FALABELLA', 
      symbol: 'FALABELLA', 
      name: 'S.A.C.I. Falabella', 
      lastPrice: 3200, 
      dailyVariation: 50, 
      dailyVariationPercent: 1.59,
      volume: 2000000
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentListComponent, InstrumentItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rendering with mock data', () => {
    beforeEach(() => {
      component.instruments = mockInstruments;
      fixture.detectChanges();
    });

    it('should render all instrument rows', () => {
      const instrumentItems = fixture.debugElement.queryAll(By.directive(InstrumentItemComponent));
      expect(instrumentItems.length).toBe(mockInstruments.length);
    });

    it('should pass correct instrument data to each item', () => {
      const instrumentItems = fixture.debugElement.queryAll(By.directive(InstrumentItemComponent));
      
      instrumentItems.forEach((item, index) => {
        const itemComponent = item.componentInstance as InstrumentItemComponent;
        expect(itemComponent.instrument).toEqual(mockInstruments[index]);
      });
    });

    it('should show table header with correct columns', () => {
      const headerElement = fixture.debugElement.query(By.css('.instrument-list-header'));
      expect(headerElement).toBeTruthy();
      
      const headerText = headerElement.nativeElement.textContent;
      expect(headerText).toContain('Instrumento');
      expect(headerText).toContain('Precio');
      expect(headerText).toContain('Var. Día');
      expect(headerText).toContain('Var. %');
      expect(headerText).toContain('Volumen');
    });

    it('should not show empty state message when instruments exist', () => {
      const emptyStateElement = fixture.debugElement.query(By.css('.text-center.p-4.text-500'));
      expect(emptyStateElement).toBeFalsy();
    });
  });

  describe('Empty state', () => {
    beforeEach(() => {
      component.instruments = [];
      fixture.detectChanges();
    });

    it('should show empty state message when no instruments', () => {
      const emptyStateElement = fixture.debugElement.query(By.css('.text-center.p-4.text-500'));
      expect(emptyStateElement).toBeTruthy();
      expect(emptyStateElement.nativeElement.textContent.trim()).toBe('No hay instrumentos disponibles');
    });

    it('should not render any instrument items when empty', () => {
      const instrumentItems = fixture.debugElement.queryAll(By.directive(InstrumentItemComponent));
      expect(instrumentItems.length).toBe(0);
    });
  });

  describe('Selection handling', () => {
    beforeEach(() => {
      component.instruments = mockInstruments;
      component.selectedInstrument = mockInstruments[1]; // Select COPEC
      fixture.detectChanges();
    });

    it('should pass isSelected correctly to instrument items', () => {
      const instrumentItems = fixture.debugElement.queryAll(By.directive(InstrumentItemComponent));
      
      instrumentItems.forEach((item, index) => {
        const itemComponent = item.componentInstance as InstrumentItemComponent;
        const expectedSelected = index === 1; // Only COPEC should be selected
        expect(itemComponent.isSelected).toBe(expectedSelected);
      });
    });
  });

  describe('Event emission', () => {
    beforeEach(() => {
      component.instruments = mockInstruments;
      fixture.detectChanges();
    });

    it('should emit select event when instrument is clicked', () => {
      spyOn(component.select, 'emit');
      
      const firstInstrumentItem = fixture.debugElement.query(By.directive(InstrumentItemComponent));
      const itemComponent = firstInstrumentItem.componentInstance as InstrumentItemComponent;
      
      // Simulate click on first instrument
      itemComponent.clicked.emit(mockInstruments[0]);
      
      expect(component.select.emit).toHaveBeenCalledWith(mockInstruments[0]);
    });

    it('should emit correct instrument when different rows are clicked', () => {
      spyOn(component.select, 'emit');
      
      const instrumentItems = fixture.debugElement.queryAll(By.directive(InstrumentItemComponent));
      
      // Click on second instrument (COPEC)
      const secondItemComponent = instrumentItems[1].componentInstance as InstrumentItemComponent;
      secondItemComponent.clicked.emit(mockInstruments[1]);
      
      expect(component.select.emit).toHaveBeenCalledWith(mockInstruments[1]);
      
      // Click on third instrument (FALABELLA)
      const thirdItemComponent = instrumentItems[2].componentInstance as InstrumentItemComponent;
      thirdItemComponent.clicked.emit(mockInstruments[2]);
      
      expect(component.select.emit).toHaveBeenCalledWith(mockInstruments[2]);
    });
  });

  describe('TrackBy function', () => {
    it('should return codeInstrument when available', () => {
      const result = component.trackByInstrument(0, mockInstruments[0]);
      expect(result).toBe('BCI');
    });

    it('should return index when codeInstrument is not available', () => {
      const instrumentWithoutCode = { symbol: 'TEST', name: 'Test Instrument' };
      const result = component.trackByInstrument(5, instrumentWithoutCode);
      expect(result).toBe(5);
    });
  });
});
