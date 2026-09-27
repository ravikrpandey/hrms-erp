import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeActionComponent } from './grade-action.component';

describe('GradeActionComponent', () => {
  let component: GradeActionComponent;
  let fixture: ComponentFixture<GradeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
