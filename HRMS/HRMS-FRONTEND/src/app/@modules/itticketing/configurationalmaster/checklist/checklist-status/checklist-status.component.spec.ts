import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistStatusComponent } from './checklist-status.component';

describe('ChecklistStatusComponent', () => {
  let component: ChecklistStatusComponent;
  let fixture: ComponentFixture<ChecklistStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
