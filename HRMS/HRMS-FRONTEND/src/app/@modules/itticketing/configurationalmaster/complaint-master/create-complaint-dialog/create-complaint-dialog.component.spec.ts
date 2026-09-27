import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComplaintDialogComponent } from './create-complaint-dialog.component';

describe('CreateComplaintDialogComponent', () => {
  let component: CreateComplaintDialogComponent;
  let fixture: ComponentFixture<CreateComplaintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateComplaintDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateComplaintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
