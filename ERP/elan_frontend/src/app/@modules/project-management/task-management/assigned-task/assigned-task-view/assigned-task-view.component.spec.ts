import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTaskViewComponent } from './assigned-task-view.component';

describe('AssignedTaskViewComponent', () => {
  let component: AssignedTaskViewComponent;
  let fixture: ComponentFixture<AssignedTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedTaskViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
