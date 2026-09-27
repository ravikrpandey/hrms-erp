import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseStatusComponent } from './warehouse-status.component';

describe('WarehouseStatusComponent', () => {
  let component: WarehouseStatusComponent;
  let fixture: ComponentFixture<WarehouseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
