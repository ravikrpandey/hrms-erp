import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterActionComponent } from './cost-center-action.component';

describe('CostCenterActionComponent', () => {
  let component: CostCenterActionComponent;
  let fixture: ComponentFixture<CostCenterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
