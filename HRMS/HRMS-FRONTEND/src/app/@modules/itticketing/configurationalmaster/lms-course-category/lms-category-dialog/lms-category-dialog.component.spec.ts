import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsCategoryDialogComponent } from './lms-category-dialog.component';

describe('LmsCategoryDialogComponent', () => {
  let component: LmsCategoryDialogComponent;
  let fixture: ComponentFixture<LmsCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmsCategoryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
