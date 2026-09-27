import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbationDialogComponent } from './probation-dialog.component';

describe('ProbationDialogComponent', () => {
  let component: ProbationDialogComponent;
  let fixture: ComponentFixture<ProbationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProbationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
