import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterHierarchyActionComponent } from './cost-center-hierarchy-action.component';

describe('CostCenterHierarchyActionComponent', () => {
  let component: CostCenterHierarchyActionComponent;
  let fixture: ComponentFixture<CostCenterHierarchyActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterHierarchyActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterHierarchyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
