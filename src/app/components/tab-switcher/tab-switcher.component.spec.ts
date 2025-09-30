import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { TabSwitcherComponent } from './tab-switcher.component';

describe('TabSwitcherComponent', () => {
  let component: TabSwitcherComponent;
  let fixture: ComponentFixture<TabSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabSwitcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default indices with IPSA selected', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(1);
    expect(buttons[0].nativeElement.textContent.trim()).toBe('IPSA');
    expect(buttons[0].nativeElement.classList).toContain('p-button-primary');
    expect(buttons[0].nativeElement.classList).not.toContain('p-button-outlined');
  });

  it('should render multiple indices correctly', () => {
    component.indices = ['IPSA', 'NASDAQ', 'S&P500'];
    component.selectedIndex = 'NASDAQ';
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(3);
    
    expect(buttons[0].nativeElement.textContent.trim()).toBe('IPSA');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('NASDAQ');
    expect(buttons[2].nativeElement.textContent.trim()).toBe('S&P500');
  });

  it('should apply correct CSS classes based on selection', () => {
    component.indices = ['IPSA', 'NASDAQ', 'S&P500'];
    component.selectedIndex = 'NASDAQ';
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    
    // IPSA (not selected)
    expect(buttons[0].nativeElement.classList).toContain('p-button-outlined');
    expect(buttons[0].nativeElement.classList).not.toContain('p-button-primary');
    
    // NASDAQ (selected)
    expect(buttons[1].nativeElement.classList).toContain('p-button-primary');
    expect(buttons[1].nativeElement.classList).not.toContain('p-button-outlined');
    
    // S&P500 (not selected)
    expect(buttons[2].nativeElement.classList).toContain('p-button-outlined');
    expect(buttons[2].nativeElement.classList).not.toContain('p-button-primary');
  });

  it('should emit indexChange when tab is clicked', () => {
    spyOn(component.indexChange, 'emit');
    
    component.indices = ['IPSA', 'NASDAQ'];
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[1].nativeElement.click();

    expect(component.indexChange.emit).toHaveBeenCalledWith('NASDAQ');
  });

  it('should emit indexChange with correct index when different tabs are clicked', () => {
    spyOn(component.indexChange, 'emit');
    
    component.indices = ['IPSA', 'NASDAQ', 'S&P500'];
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    
    // Click first tab
    buttons[0].nativeElement.click();
    expect(component.indexChange.emit).toHaveBeenCalledWith('IPSA');
    
    // Click third tab
    buttons[2].nativeElement.click();
    expect(component.indexChange.emit).toHaveBeenCalledWith('S&P500');
    
    expect(component.indexChange.emit).toHaveBeenCalledTimes(2);
  });

  it('should call onTabClick method when button is clicked', () => {
    spyOn(component, 'onTabClick');
    
    component.indices = ['IPSA', 'NASDAQ'];
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[0].nativeElement.click();

    expect(component.onTabClick).toHaveBeenCalledWith('IPSA');
  });

  it('should handle empty indices array', () => {
    component.indices = [];
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(0);
  });

  it('should handle single index', () => {
    component.indices = ['NASDAQ'];
    component.selectedIndex = 'NASDAQ';
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(1);
    expect(buttons[0].nativeElement.textContent.trim()).toBe('NASDAQ');
    expect(buttons[0].nativeElement.classList).toContain('p-button-primary');
  });

  it('should have correct CSS classes on all buttons', () => {
    component.indices = ['IPSA', 'NASDAQ'];
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    
    buttons.forEach(button => {
      expect(button.nativeElement.classList).toContain('p-button');
      expect(button.nativeElement.classList).toContain('p-button-sm');
      expect(button.nativeElement.classList).toContain('border-round');
    });
  });

  it('should render container with correct structure', () => {
    const container = fixture.debugElement.query(By.css('.tab-switcher-container'));
    const flexContainer = fixture.debugElement.query(By.css('.flex.gap-2'));
    
    expect(container).toBeTruthy();
    expect(flexContainer).toBeTruthy();
    expect(flexContainer.nativeElement.classList).toContain('flex');
    expect(flexContainer.nativeElement.classList).toContain('gap-2');
  });

  it('should update selection styling when selectedIndex changes', () => {
    component.indices = ['IPSA', 'NASDAQ', 'S&P500'];
    component.selectedIndex = 'IPSA';
    fixture.detectChanges();

    let buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].nativeElement.classList).toContain('p-button-primary');
    expect(buttons[1].nativeElement.classList).toContain('p-button-outlined');

    // Change selection
    component.selectedIndex = 'NASDAQ';
    fixture.detectChanges();

    buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].nativeElement.classList).toContain('p-button-outlined');
    expect(buttons[1].nativeElement.classList).toContain('p-button-primary');
  });
});
