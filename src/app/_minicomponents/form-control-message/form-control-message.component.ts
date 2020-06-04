import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../../_services';

@Component({
  selector: 'app-form-control-message',
  templateUrl: './form-control-message.component.html',
  styleUrls: ['./form-control-message.component.scss']
})
export class FormControlMessageComponent implements OnInit {
  @Input() control: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }

    return null;
  }

}
