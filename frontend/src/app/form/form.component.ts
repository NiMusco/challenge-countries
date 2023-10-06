import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  formData = { name: '', capital: '', continents: '' };

  @Output() formSubmit = new EventEmitter<any>();

  onSubmit() {
    this.formSubmit.emit(this.formData);
  }
}
