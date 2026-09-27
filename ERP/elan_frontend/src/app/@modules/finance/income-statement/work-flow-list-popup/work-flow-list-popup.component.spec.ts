import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowListPopupComponent } from './work-flow-list-popup.component';

describe('WorkFlowListPopupComponent', () => {
  let component: WorkFlowListPopupComponent;
  let fixture: ComponentFixture<WorkFlowListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowListPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
