import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppListDialogComponent } from './app-list-dialog.component';

describe('JobListDialogComponent', () => {
  let component: AppListDialogComponent;
  let fixture: ComponentFixture<AppListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
