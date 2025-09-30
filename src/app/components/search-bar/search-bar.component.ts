import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  @Output() queryChange = new EventEmitter<string>();

  onInputChange(event: any): void {
    const target = event.target as HTMLInputElement;
    this.queryChange.emit(target.value);
  }
}
