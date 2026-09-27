import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbacmasterComponent } from './rbacmaster.component';

describe('RbacmasterComponent', () => {
  let component: RbacmasterComponent;
  let fixture: ComponentFixture<RbacmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RbacmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbacmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
