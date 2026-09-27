import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacRoleListComponent } from './rbac-role-list.component';

describe('RbacRoleListComponent', () => {
  let component: RbacRoleListComponent;
  let fixture: ComponentFixture<RbacRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacRoleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
