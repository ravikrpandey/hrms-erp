import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedDeliveryDaysDialogComponent } from './expected-delivery-days-dialog.component';

describe('ExpectedDeliveryDaysDialogComponent', () => {
  let component: ExpectedDeliveryDaysDialogComponent;
  let fixture: ComponentFixture<ExpectedDeliveryDaysDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpectedDeliveryDaysDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpectedDeliveryDaysDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
