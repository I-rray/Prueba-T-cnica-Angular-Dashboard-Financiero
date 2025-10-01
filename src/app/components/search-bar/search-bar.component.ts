import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @Output() queryChange = new EventEmitter<string>();

  isFocused = false;
  hasValue = false;
  isSearching = false;
  isLoading = false;

  onInputChange(event: any): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    this.hasValue = value.length > 0;
    this.isSearching = value.length > 0;
    
    // Simulate loading state for demo
    if (value.length > 0) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } else {
      this.isLoading = false;
    }
    
    this.queryChange.emit(value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
  }

  clearSearch(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
      this.hasValue = false;
      this.isSearching = false;
      this.isLoading = false;
      this.queryChange.emit('');
      this.searchInput.nativeElement.focus();
    }
  }
}
