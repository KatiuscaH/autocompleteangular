import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


interface ValueOption {
  name: string;
  value: string;
}

interface Option {
  name: string;
  values: ValueOption[];
}
/**
 * @title Highlight the first autocomplete option
 */
@Component({
  selector: 'autocomplete-auto-active-first-option-example',
  templateUrl: 'autocomplete-auto-active-first-option-example.html',
  styleUrl: 'autocomplete-auto-active-first-option-example.css',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgFor,
  ],
})
export class AutocompleteAutoActiveFirstOptionExample implements OnInit {
  options: Option[] = [
    {
      name: 'Category A',
      values: [
        { name: 'Option A1', value: 'A1' },
        { name: 'Option A2', value: 'A2' },
        { name: 'Option A3', value: 'A3' },
      ]
    },
    {
      name: 'Category B',
      values: [
        { name: 'Option B1', value: 'B1' },
        { name: 'Option B2', value: 'B2' },
        { name: 'Option B3', value: 'B3' },
      ]
    },
    {
      name: 'Category C',
      values: [
        { name: 'Option C1', value: 'C1' },
        { name: 'Option C2', value: 'C2' },
        { name: 'Option C3', value: 'C3' },
      ]
    }
  ];
  selectedOptionsChange = new EventEmitter<{ name: string, value: string }[]>();
  form: FormGroup;
  filteredOptions: Observable<ValueOption[]>[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      optionsArray: this.fb.array([])
    });

    this.form.valueChanges.subscribe(() => {
      this.emitSelectedOptions();
    });
  }

  ngOnInit() {
    this.options.forEach(() => this.addOption());
  }

  get optionsArray() {
    return this.form.get('optionsArray') as FormArray;
  }

  addOption() {
    const control = new FormControl();
    this.optionsArray.push(control);
    const index = this.optionsArray.length - 1;
    this.filteredOptions.push(
      control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, index))
      )
    );
  }

  private _filter(value: string, index: number): ValueOption[] {
    const filterValue = value.toLowerCase();
    return this.options[index].values.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private emitSelectedOptions() {
    const selectedOptions = this.optionsArray.controls.map((control, index) => {
      return { name: this.options[index].name, value: control.value };
    });
    this.selectedOptionsChange.emit(selectedOptions);
    console.log(selectedOptions)

  }

}

/**  Copyright 2024 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
