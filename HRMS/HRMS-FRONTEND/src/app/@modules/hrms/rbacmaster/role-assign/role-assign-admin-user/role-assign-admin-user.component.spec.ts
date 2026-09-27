import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAssignAdminUserComponent } from './role-assign-admin-user.component';

describe('RoleAssignAdminUserComponent', () => {
  let component: RoleAssignAdminUserComponent;
  let fixture: ComponentFixture<RoleAssignAdminUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleAssignAdminUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleAssignAdminUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
