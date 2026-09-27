import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendRfpDateDialogComponent } from './extend-rfp-date-dialog.component';

describe('ExtendRfpDateDialogComponent', () => {
  let component: ExtendRfpDateDialogComponent;
  let fixture: ComponentFixture<ExtendRfpDateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendRfpDateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendRfpDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
