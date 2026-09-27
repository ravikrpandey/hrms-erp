import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseManagementSystemComponent } from './warehouse-management-system.component';

describe('WarehouseManagementSystemComponent', () => {
  let component: WarehouseManagementSystemComponent;
  let fixture: ComponentFixture<WarehouseManagementSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseManagementSystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseManagementSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
