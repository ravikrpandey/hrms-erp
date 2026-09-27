import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowListPopComponent } from './work-flow-list-pop.component';

describe('WorkFlowListPopComponent', () => {
  let component: WorkFlowListPopComponent;
  let fixture: ComponentFixture<WorkFlowListPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowListPopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowListPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
