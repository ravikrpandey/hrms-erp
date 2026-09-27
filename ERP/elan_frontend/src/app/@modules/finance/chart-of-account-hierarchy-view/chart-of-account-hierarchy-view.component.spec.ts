import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountHierarchyViewComponent } from './chart-of-account-hierarchy-view.component';

describe('ChartOfAccountHierarchyViewComponent', () => {
  let component: ChartOfAccountHierarchyViewComponent;
  let fixture: ComponentFixture<ChartOfAccountHierarchyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartOfAccountHierarchyViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartOfAccountHierarchyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
