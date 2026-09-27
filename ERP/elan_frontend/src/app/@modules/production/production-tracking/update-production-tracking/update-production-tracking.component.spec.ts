import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductionTrackingComponent } from './update-production-tracking.component';

describe('UpdateProductionTrackingComponent', () => {
  let component: UpdateProductionTrackingComponent;
  let fixture: ComponentFixture<UpdateProductionTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProductionTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProductionTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
