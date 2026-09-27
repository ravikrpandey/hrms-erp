import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowRfpComponent } from './work-flow-rfp.component';

describe('WorkFlowRfpComponent', () => {
  let component: WorkFlowRfpComponent;
  let fixture: ComponentFixture<WorkFlowRfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowRfpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
