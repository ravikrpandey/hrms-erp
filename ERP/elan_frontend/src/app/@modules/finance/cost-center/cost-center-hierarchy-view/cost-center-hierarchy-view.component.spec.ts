import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterHierarchyViewComponent } from './cost-center-hierarchy-view.component';

describe('CostCenterHierarchyViewComponent', () => {
  let component: CostCenterHierarchyViewComponent;
  let fixture: ComponentFixture<CostCenterHierarchyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterHierarchyViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterHierarchyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
