import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionWarehouseComponent } from './action-warehouse.component';

describe('ActionWarehouseComponent', () => {
  let component: ActionWarehouseComponent;
  let fixture: ComponentFixture<ActionWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionWarehouseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
