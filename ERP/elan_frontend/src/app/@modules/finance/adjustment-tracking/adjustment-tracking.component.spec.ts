import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentTrackingComponent } from './adjustment-tracking.component';

describe('AdjustmentTrackingComponent', () => {
  let component: AdjustmentTrackingComponent;
  let fixture: ComponentFixture<AdjustmentTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
