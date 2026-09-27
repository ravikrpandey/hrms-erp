import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingApprovelEmpComponent } from './pending-approvel-emp.component';

describe('PendingApprovelEmpComponent', () => {
  let component: PendingApprovelEmpComponent;
  let fixture: ComponentFixture<PendingApprovelEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingApprovelEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingApprovelEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
