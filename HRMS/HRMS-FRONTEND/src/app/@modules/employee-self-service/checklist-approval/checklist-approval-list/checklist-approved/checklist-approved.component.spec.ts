import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistApprovedComponent } from './checklist-approved.component';

describe('ChecklistApprovedComponent', () => {
  let component: ChecklistApprovedComponent;
  let fixture: ComponentFixture<ChecklistApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistApprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
