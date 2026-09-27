import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionMaintenanceComponent } from './production-maintenance.component';

describe('ProductionMaintenanceComponent', () => {
  let component: ProductionMaintenanceComponent;
  let fixture: ComponentFixture<ProductionMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
