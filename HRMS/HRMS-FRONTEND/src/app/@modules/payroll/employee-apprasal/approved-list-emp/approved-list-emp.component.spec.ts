import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedListEmpComponent } from './approved-list-emp.component';

describe('ApprovedListEmpComponent', () => {
  let component: ApprovedListEmpComponent;
  let fixture: ComponentFixture<ApprovedListEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedListEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedListEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
