import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';


import { ValidationService, AuthenticationService, UserService, AlertService, PaymentService } from '../../_services';



@Component({
  selector: 'app-receive-portal',
  templateUrl: './receive-portal.component.html',
  styleUrls: ['./receive-portal.component.less']
})
export class ReceivePortalComponent implements OnInit {
  id:string;

  constructor(
    private http: HttpClientModule,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id")
  }

}
