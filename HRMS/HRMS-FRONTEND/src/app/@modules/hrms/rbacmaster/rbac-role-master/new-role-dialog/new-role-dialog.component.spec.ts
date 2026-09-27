import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoleDialogComponent } from './new-role-dialog.component';

describe('NewRoleDialogComponent', () => {
  let component: NewRoleDialogComponent;
  let fixture: ComponentFixture<NewRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRoleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
