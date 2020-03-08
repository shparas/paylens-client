import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { User } from '../_models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
  @Input() currentUser: User;
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }
  
  ngOnInit(): void {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

}
