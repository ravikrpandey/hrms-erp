import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalChargeStatusActionComponent } from './additional-charge-status-action.component';

describe('AdditionalChargeStatusActionComponent', () => {
  let component: AdditionalChargeStatusActionComponent;
  let fixture: ComponentFixture<AdditionalChargeStatusActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalChargeStatusActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalChargeStatusActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
