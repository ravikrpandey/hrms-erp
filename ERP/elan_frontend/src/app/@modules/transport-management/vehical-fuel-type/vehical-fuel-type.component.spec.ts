import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalFuelTypeComponent } from './vehical-fuel-type.component';

describe('VehicalFuelTypeComponent', () => {
  let component: VehicalFuelTypeComponent;
  let fixture: ComponentFixture<VehicalFuelTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicalFuelTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicalFuelTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
