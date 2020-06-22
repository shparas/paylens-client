import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { ValidationService, AuthenticationService, UserService, AlertService } from '../_services';

@Component({
  selector: 'app-main',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  login = false;
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
    // log out user if called from /log-out page
    if (window.location.pathname.split('/')[1] == "log-out"){
      this.authenticationService.logout();
      this.router.navigate(['/']);
    }
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailOrPhone: '', // ['', [Validators.required, ValidationService.emailValidator]],
      password: ''
    });
    this.registerForm = this.formBuilder.group({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      password: ''
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }
  
  onLogin() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.loginForm.controls.emailOrPhone.value, this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error("Invalid email/phone or password");
          this.loading = false;
        });
  }
  
  onRegister() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.register(this.registerForm.value)
      .pipe(first())
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
