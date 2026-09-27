import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCostProfitCenterComponent } from './add-cost-profit-center.component';

describe('AddCostProfitCenterComponent', () => {
  let component: AddCostProfitCenterComponent;
  let fixture: ComponentFixture<AddCostProfitCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCostProfitCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCostProfitCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
