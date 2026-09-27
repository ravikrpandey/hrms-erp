import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseActionComponent } from './warehouse-action.component';

describe('WarehouseActionComponent', () => {
  let component: WarehouseActionComponent;
  let fixture: ComponentFixture<WarehouseActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
