import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousebifurcationActionComponent } from './warehousebifurcation-action.component';

describe('WarehousebifurcationActionComponent', () => {
  let component: WarehousebifurcationActionComponent;
  let fixture: ComponentFixture<WarehousebifurcationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehousebifurcationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehousebifurcationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
