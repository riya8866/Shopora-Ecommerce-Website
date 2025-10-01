import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [...MATERIAL_IMPORTS, CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Input() query: string = '';
  // @Input() liveSearch: boolean = true;   // <-- new flag (default = live search ON)

  @Output() queryChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();

  private searchSubject = new Subject<string>();

  onSearch() {
    this.queryChange.emit(this.query);
    this.search.emit(this.query);
  }

  constructor() {
    //debounce + length filter added
    this.searchSubject.pipe(
      debounceTime(300),              // wait 300ms before firing
      distinctUntilChanged(),         // only fire when query changes
      filter(q => q.length >= 2)      // only trigger if at least 2 characters
    ).subscribe(q => {
      this.queryChange.emit(q);
      this.search.emit(q);
    });
  }

  // input changes now go through searchSubject
  onInputChange(value: string) {
    this.query = value;
    this.searchSubject.next(value);
  }

  // Button still works instantly (even if <2 chars)
  onSearchClick() {
    this.queryChange.emit(this.query);
    this.search.emit(this.query);
  }

  // onQueryChange() {
  //   if (this.liveSearch) {
  //     this.queryChange.emit(this.query);
  //     this.search.emit(this.query);
  //   }
  // }
}
