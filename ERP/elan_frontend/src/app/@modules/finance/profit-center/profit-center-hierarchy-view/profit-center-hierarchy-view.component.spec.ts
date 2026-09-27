import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitCenterHierarchyViewComponent } from './profit-center-hierarchy-view.component';

describe('ProfitCenterHierarchyViewComponent', () => {
  let component: ProfitCenterHierarchyViewComponent;
  let fixture: ComponentFixture<ProfitCenterHierarchyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitCenterHierarchyViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitCenterHierarchyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
