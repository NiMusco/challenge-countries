import { Component, Output, EventEmitter } from '@angular/core';

interface FormData {
  name: string;
  capital: string;
  continents: string;
}

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent {
    formData: FormData = { name: '', capital: '', continents: '' };

  @Output() formSubmit = new EventEmitter<FormData>();

  onSubmit() {
      this.formSubmit.emit(this.formData);
  }
}
