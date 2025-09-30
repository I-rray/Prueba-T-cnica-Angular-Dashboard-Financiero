import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  const mockHistoryPoints = [
    { date: '2024-01-01', value: 100, price: 25000 },
    { date: '2024-01-02', value: 102, price: 25500 },
    { date: '2024-01-03', value: 98, price: 24500 },
    { date: '2024-01-04', value: 105, price: 26250 },
    { date: '2024-01-05', value: 103, price: 25750 },
    { date: '2024-01-06', value: 107, price: 26750 },
    { date: '2024-01-07', value: 104, price: 26000 },
    { date: '2024-01-08', value: 109, price: 27250 },
    { date: '2024-01-09', value: 106, price: 26500 },
    { date: '2024-01-10', value: 111, price: 27750 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have default period as 1M', () => {
      expect(component.period).toBe('1M');
    });

    it('should have empty points array by default', () => {
      expect(component.points).toEqual([]);
    });

    it('should display all period buttons', () => {
      const periodButtons = fixture.debugElement.queryAll(By.css('button'));
      expect(periodButtons.length).toBe(4);
      
      const buttonTexts = periodButtons.map(btn => btn.nativeElement.textContent.trim());
      expect(buttonTexts).toEqual(['1M', '3M', '6M', '1A']);
    });

    it('should highlight current period button', () => {
      const activeButton = fixture.debugElement.query(By.css('.p-button-primary'));
      expect(activeButton.nativeElement.textContent.trim()).toBe('1M');
    });
  });

  describe('With mock data', () => {
    beforeEach(() => {
      component.points = mockHistoryPoints;
      component.period = '1M';
      fixture.detectChanges();
    });

    it('should generate dataset with provided points', () => {
      const filteredPoints = component.filteredPoints;
      expect(filteredPoints.length).toBe(10); // All points for 1M period
      expect(filteredPoints).toEqual(mockHistoryPoints);
    });

    it('should display correct number of data points', () => {
      const dataPointsElement = fixture.debugElement.query(By.css('p.text-600'));
      expect(dataPointsElement.nativeElement.textContent.trim()).toBe('10 puntos de datos disponibles');
    });

    it('should show first point data preview', () => {
      const firstPointSection = fixture.debugElement.query(By.css('.col-6'));
      const dateElement = firstPointSection.query(By.css('div:nth-child(1)'));
      const valueElement = firstPointSection.query(By.css('div:nth-child(2)'));
      const priceElement = firstPointSection.query(By.css('div:nth-child(3)'));

      expect(dateElement.nativeElement.textContent).toContain('2024-01-01');
      expect(valueElement.nativeElement.textContent).toContain('100');
      expect(priceElement.nativeElement.textContent).toContain('25,000.00');
    });

    it('should show chart title', () => {
      const titleElement = fixture.debugElement.query(By.css('h3.text-xl'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Evolución del Precio');
    });

    it('should display current period in data info', () => {
      const periodInfoElement = fixture.debugElement.query(By.css('h4.text-lg'));
      expect(periodInfoElement.nativeElement.textContent.trim()).toBe('Datos del Período: 1M');
    });
  });

  describe('Period filtering', () => {
    beforeEach(() => {
      // Create a larger dataset for testing filtering
      const largeDataset = [];
      for (let i = 0; i < 400; i++) {
        largeDataset.push({
          date: `2024-01-${String(i + 1).padStart(2, '0')}`,
          value: 100 + Math.random() * 20,
          price: 25000 + Math.random() * 5000
        });
      }
      component.points = largeDataset;
    });

    it('should filter points correctly for 1M period', () => {
      component.period = '1M';
      fixture.detectChanges();
      
      const filteredPoints = component.filteredPoints;
      expect(filteredPoints.length).toBe(30); // Last 30 points
    });

    it('should filter points correctly for 3M period', () => {
      component.period = '3M';
      fixture.detectChanges();
      
      const filteredPoints = component.filteredPoints;
      expect(filteredPoints.length).toBe(90); // Last 90 points
    });

    it('should filter points correctly for 6M period', () => {
      component.period = '6M';
      fixture.detectChanges();
      
      const filteredPoints = component.filteredPoints;
      expect(filteredPoints.length).toBe(180); // Last 180 points
    });

    it('should filter points correctly for 1A period', () => {
      component.period = '1A';
      fixture.detectChanges();
      
      const filteredPoints = component.filteredPoints;
      expect(filteredPoints.length).toBe(365); // Last 365 points
    });

    it('should return all points when dataset is smaller than filter', () => {
      component.points = mockHistoryPoints; // Only 10 points
      component.period = '3M'; // Should show 90 points
      fixture.detectChanges();
      
      const filteredPoints = component.filteredPoints;
      expect(filteredPoints.length).toBe(10); // All available points
    });
  });

  describe('Period change events', () => {
    beforeEach(() => {
      component.points = mockHistoryPoints;
      fixture.detectChanges();
    });

    it('should emit periodChange event when 3M button is clicked', () => {
      spyOn(component.periodChange, 'emit');
      
      const threeMButton = fixture.debugElement.queryAll(By.css('button'))[1]; // Second button is 3M
      threeMButton.nativeElement.click();
      
      expect(component.periodChange.emit).toHaveBeenCalledWith('3M');
    });

    it('should emit periodChange event when 6M button is clicked', () => {
      spyOn(component.periodChange, 'emit');
      
      const sixMButton = fixture.debugElement.queryAll(By.css('button'))[2]; // Third button is 6M
      sixMButton.nativeElement.click();
      
      expect(component.periodChange.emit).toHaveBeenCalledWith('6M');
    });

    it('should emit periodChange event when 1A button is clicked', () => {
      spyOn(component.periodChange, 'emit');
      
      const oneYearButton = fixture.debugElement.queryAll(By.css('button'))[3]; // Fourth button is 1A
      oneYearButton.nativeElement.click();
      
      expect(component.periodChange.emit).toHaveBeenCalledWith('1A');
    });

    it('should update button highlighting when period changes', () => {
      component.period = '3M';
      fixture.detectChanges();
      
      const activeButton = fixture.debugElement.query(By.css('.p-button-primary'));
      expect(activeButton.nativeElement.textContent.trim()).toBe('3M');
      
      const inactiveButtons = fixture.debugElement.queryAll(By.css('.p-button-outlined'));
      expect(inactiveButtons.length).toBe(3); // Other 3 buttons should be outlined
    });
  });

  describe('Empty state', () => {
    beforeEach(() => {
      component.points = [];
      fixture.detectChanges();
    });

    it('should show 0 data points when no data', () => {
      const dataPointsElement = fixture.debugElement.query(By.css('p.text-600'));
      expect(dataPointsElement.nativeElement.textContent.trim()).toBe('0 puntos de datos disponibles');
    });

    it('should not show data preview when no points', () => {
      const dataPreviewElement = fixture.debugElement.query(By.css('.w-full.max-w-30rem'));
      expect(dataPreviewElement).toBeFalsy();
    });

    it('should show chart icon placeholder', () => {
      const chartIcon = fixture.debugElement.query(By.css('i.pi-chart-line'));
      expect(chartIcon).toBeTruthy();
    });

    it('should return empty array for filteredPoints', () => {
      expect(component.filteredPoints).toEqual([]);
    });
  });

  describe('onPeriodClick method', () => {
    it('should call onPeriodClick with correct period', () => {
      component.points = mockHistoryPoints;
      fixture.detectChanges();
      
      spyOn(component, 'onPeriodClick');
      
      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.click();
      
      expect(component.onPeriodClick).toHaveBeenCalledWith('1M');
    });

    it('should emit periodChange when onPeriodClick is called directly', () => {
      spyOn(component.periodChange, 'emit');
      
      component.onPeriodClick('6M');
      
      expect(component.periodChange.emit).toHaveBeenCalledWith('6M');
    });
  });

  describe('Data structure handling', () => {
    it('should handle points with different properties', () => {
      const mixedPoints = [
        { date: '2024-01-01', value: 100 },
        { date: '2024-01-02', price: 25000 },
        { date: '2024-01-03', value: 102, price: 25500 }
      ];
      
      component.points = mixedPoints;
      fixture.detectChanges();
      
      expect(component.filteredPoints.length).toBe(3);
      expect(component.filteredPoints).toEqual(mixedPoints);
    });

    it('should handle null or undefined points gracefully', () => {
      component.points = null as any;
      fixture.detectChanges();
      
      expect(component.filteredPoints).toEqual([]);
    });
  });
});
