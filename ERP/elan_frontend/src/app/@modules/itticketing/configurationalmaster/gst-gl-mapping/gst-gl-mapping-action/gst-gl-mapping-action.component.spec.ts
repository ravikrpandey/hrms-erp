import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalChargeActionComponent } from './additional-charge-action.component';

describe('AdditionalChargeActionComponent', () => {
  let component: AdditionalChargeActionComponent;
  let fixture: ComponentFixture<AdditionalChargeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalChargeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalChargeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
