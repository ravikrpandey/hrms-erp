import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostProfitCenterListComponent } from './cost-profit-center-list.component';

describe('CostProfitCenterListComponent', () => {
  let component: CostProfitCenterListComponent;
  let fixture: ComponentFixture<CostProfitCenterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostProfitCenterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostProfitCenterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
