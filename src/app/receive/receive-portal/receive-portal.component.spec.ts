import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePortalComponent } from './receive-portal.component';

describe('ReceivePortalComponent', () => {
  let component: ReceivePortalComponent;
  let fixture: ComponentFixture<ReceivePortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivePortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
