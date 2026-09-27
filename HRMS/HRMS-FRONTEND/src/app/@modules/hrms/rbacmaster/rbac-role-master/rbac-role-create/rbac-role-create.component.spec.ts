import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacRoleCreateComponent } from './rbac-role-create.component';

describe('RbacRoleCreateComponent', () => {
  let component: RbacRoleCreateComponent;
  let fixture: ComponentFixture<RbacRoleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacRoleCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacRoleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
