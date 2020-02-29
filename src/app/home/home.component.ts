import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { ValidationService, AuthenticationService, UserService, AlertService } from '../_services';

@Component({
  selector: 'app-main',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public login = true;

  loginForm: any;
  registerForm: any;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private http: HttpClientModule,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/dash']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailOrPhone: ['', [Validators.required, ValidationService.emailValidator]],
      password: ''
    });
    this.registerForm = this.formBuilder.group({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      password: ''
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dash';
  }

  get lF() { return this.loginForm.controls; }

  onLogin() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
console.log(this.lF.emailOrPhone.value);
    this.authenticationService.login(this.lF.emailOrPhone.value, this.lF.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  get rF() { return this.registerForm.controls; }
  onRegister() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/dash']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
