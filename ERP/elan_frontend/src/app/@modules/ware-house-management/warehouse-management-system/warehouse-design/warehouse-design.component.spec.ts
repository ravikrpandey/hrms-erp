import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseDesignComponent } from './warehouse-design.component';

describe('WarehouseDesignComponent', () => {
  let component: WarehouseDesignComponent;
  let fixture: ComponentFixture<WarehouseDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseDesignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
