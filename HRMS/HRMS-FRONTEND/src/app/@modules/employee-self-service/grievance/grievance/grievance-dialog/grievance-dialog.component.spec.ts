import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceDialogComponent } from './grievance-dialog.component';

describe('GrievanceDialogComponent', () => {
  let component: GrievanceDialogComponent;
  let fixture: ComponentFixture<GrievanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
