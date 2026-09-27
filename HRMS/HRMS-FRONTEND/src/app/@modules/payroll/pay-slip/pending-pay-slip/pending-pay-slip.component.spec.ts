import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPaySlipComponent } from './pending-pay-slip.component';

describe('PendingPaySlipComponent', () => {
  let component: PendingPaySlipComponent;
  let fixture: ComponentFixture<PendingPaySlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingPaySlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingPaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
