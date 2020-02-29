import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlMessageComponent } from './form-control-message.component';

describe('FormControlMessageComponent', () => {
  let component: FormControlMessageComponent;
  let fixture: ComponentFixture<FormControlMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormControlMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControlMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
