import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionTrackingComponent } from './production-tracking.component';

describe('ProductionTrackingComponent', () => {
  let component: ProductionTrackingComponent;
  let fixture: ComponentFixture<ProductionTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
