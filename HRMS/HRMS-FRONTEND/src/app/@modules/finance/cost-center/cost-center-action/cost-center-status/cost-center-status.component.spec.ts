import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterStatusComponent } from './cost-center-status.component';

describe('CostCenterStatusComponent', () => {
  let component: CostCenterStatusComponent;
  let fixture: ComponentFixture<CostCenterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
