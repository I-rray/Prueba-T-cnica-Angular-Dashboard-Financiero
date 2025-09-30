import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input with placeholder', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement).toBeTruthy();
    expect(inputElement.nativeElement.placeholder).toBe('Buscar instrumentos...');
    expect(inputElement.nativeElement.type).toBe('text');
  });

  it('should render search icon', () => {
    const iconElement = fixture.debugElement.query(By.css('i.pi-search'));
    expect(iconElement).toBeTruthy();
  });

  it('should emit queryChange when input value changes', () => {
    spyOn(component.queryChange, 'emit');
    
    const inputElement = fixture.debugElement.query(By.css('input'));
    const inputNativeElement = inputElement.nativeElement;
    
    inputNativeElement.value = 'AAPL';
    inputNativeElement.dispatchEvent(new Event('input'));
    
    expect(component.queryChange.emit).toHaveBeenCalledWith('AAPL');
  });

  it('should emit queryChange with empty string when input is cleared', () => {
    spyOn(component.queryChange, 'emit');
    
    const inputElement = fixture.debugElement.query(By.css('input'));
    const inputNativeElement = inputElement.nativeElement;
    
    inputNativeElement.value = '';
    inputNativeElement.dispatchEvent(new Event('input'));
    
    expect(component.queryChange.emit).toHaveBeenCalledWith('');
  });

  it('should emit queryChange multiple times for different input values', () => {
    const emitSpy = spyOn(component.queryChange, 'emit');
    
    const inputElement = fixture.debugElement.query(By.css('input'));
    const inputNativeElement = inputElement.nativeElement;
    
    // First input
    inputNativeElement.value = 'A';
    inputNativeElement.dispatchEvent(new Event('input'));
    
    // Second input
    inputNativeElement.value = 'AA';
    inputNativeElement.dispatchEvent(new Event('input'));
    
    // Third input
    inputNativeElement.value = 'AAPL';
    inputNativeElement.dispatchEvent(new Event('input'));
    
    expect(emitSpy).toHaveBeenCalledTimes(3);
    expect(emitSpy.calls.argsFor(0)).toEqual(['A']);
    expect(emitSpy.calls.argsFor(1)).toEqual(['AA']);
    expect(emitSpy.calls.argsFor(2)).toEqual(['AAPL']);
  });

  it('should call onInputChange method when input event is triggered', () => {
    spyOn(component, 'onInputChange');
    
    const inputElement = fixture.debugElement.query(By.css('input'));
    const inputNativeElement = inputElement.nativeElement;
    
    inputNativeElement.value = 'test';
    inputNativeElement.dispatchEvent(new Event('input'));
    
    expect(component.onInputChange).toHaveBeenCalled();
  });

  it('should have correct CSS classes applied', () => {
    const containerElement = fixture.debugElement.query(By.css('.search-container'));
    const spanElement = fixture.debugElement.query(By.css('.p-input-icon-left'));
    const inputElement = fixture.debugElement.query(By.css('input'));
    
    expect(containerElement.nativeElement.classList).toContain('search-container');
    expect(containerElement.nativeElement.classList).toContain('w-full');
    expect(containerElement.nativeElement.classList).toContain('md:w-20rem');
    
    expect(spanElement.nativeElement.classList).toContain('p-input-icon-left');
    expect(spanElement.nativeElement.classList).toContain('w-full');
    
    expect(inputElement.nativeElement.classList).toContain('p-inputtext');
    expect(inputElement.nativeElement.classList).toContain('p-component');
    expect(inputElement.nativeElement.classList).toContain('w-full');
  });
});
