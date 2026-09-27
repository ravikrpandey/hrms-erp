import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOrderPdfComponent } from './task-order-pdf.component';

describe('TaskOrderPdfComponent', () => {
  let component: TaskOrderPdfComponent;
  let fixture: ComponentFixture<TaskOrderPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskOrderPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskOrderPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
