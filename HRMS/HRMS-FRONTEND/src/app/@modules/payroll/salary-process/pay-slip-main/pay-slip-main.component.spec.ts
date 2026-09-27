import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySlipMainComponent } from './pay-slip-main.component';

describe('PaySlipMainComponent', () => {
  let component: PaySlipMainComponent;
  let fixture: ComponentFixture<PaySlipMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaySlipMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaySlipMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
