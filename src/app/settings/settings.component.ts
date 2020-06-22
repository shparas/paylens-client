import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators'; import { ValidationService, AuthenticationService, UserService, AlertService } from '../_services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  updateSettingsForm: any;
  submitted = false;
  loading = false;

  constructor(
    private http: HttpClientModule,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.updateSettingsForm = this.formBuilder.group({
      firstname: this.authenticationService.currentUserValue.userInfo.firstname,
      lastname: this.authenticationService.currentUserValue.userInfo.lastname,
      email: this.authenticationService.currentUserValue.userInfo.email,
      phone: this.authenticationService.currentUserValue.userInfo.phone,
      oldPassword: '',
      newPassword: '' 
    });
  }

  get uF() { return this.updateSettingsForm.controls; }
  onUpdate() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.updateSettingsForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .update(this.updateSettingsForm.value)
      .subscribe(
        data => {
          this.router.navigate(['/home']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
