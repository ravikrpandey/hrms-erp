import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowPrpoActionComponent } from './work-flow-prpo-action.component';

describe('WorkFlowPrpoActionComponent', () => {
  let component: WorkFlowPrpoActionComponent;
  let fixture: ComponentFixture<WorkFlowPrpoActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowPrpoActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowPrpoActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
