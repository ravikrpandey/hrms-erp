import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnWarehouseAllocationFormComponent } from './grn-warehouse-allocation-form.component';

describe('GrnWarehouseAllocationFormComponent', () => {
  let component: GrnWarehouseAllocationFormComponent;
  let fixture: ComponentFixture<GrnWarehouseAllocationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnWarehouseAllocationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnWarehouseAllocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
