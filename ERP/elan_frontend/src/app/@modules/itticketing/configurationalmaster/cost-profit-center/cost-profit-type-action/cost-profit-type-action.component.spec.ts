import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostProfitTypeActionComponent } from './cost-profit-type-action.component';

describe('CostProfitTypeActionComponent', () => {
  let component: CostProfitTypeActionComponent;
  let fixture: ComponentFixture<CostProfitTypeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostProfitTypeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostProfitTypeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
