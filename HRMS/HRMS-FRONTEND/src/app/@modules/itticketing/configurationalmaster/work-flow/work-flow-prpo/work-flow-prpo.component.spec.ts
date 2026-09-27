import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowPrpoComponent } from './work-flow-prpo.component';

describe('WorkFlowPrpoComponent', () => {
  let component: WorkFlowPrpoComponent;
  let fixture: ComponentFixture<WorkFlowPrpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowPrpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFlowPrpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
