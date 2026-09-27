import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseBifurcationActionComponent } from './warehouse-bifurcation-action.component';

describe('WarehouseBifurcationActionComponent', () => {
  let component: WarehouseBifurcationActionComponent;
  let fixture: ComponentFixture<WarehouseBifurcationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseBifurcationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseBifurcationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
