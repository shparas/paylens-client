import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.less']
})
export class AccountCardComponent implements OnInit {
  @Input() account: any;

  getBackground(){
    return {
      backgroundColor: this.account.institution.color,
      backgroundImage: `url(data:image/png;base64,${this.account.institution.logo})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center'
    }
  }
  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }
}
