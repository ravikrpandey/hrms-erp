import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpListDialogComponent } from './emp-list-dialog.component';

describe('EmpListDialogComponent', () => {
  let component: EmpListDialogComponent;
  let fixture: ComponentFixture<EmpListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
