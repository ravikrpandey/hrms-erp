import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeStatusComponent } from './grade-status.component';

describe('GradeStatusComponent', () => {
  let component: GradeStatusComponent;
  let fixture: ComponentFixture<GradeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
