import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectListEmpComponent } from './reject-list-emp.component';

describe('RejectListEmpComponent', () => {
  let component: RejectListEmpComponent;
  let fixture: ComponentFixture<RejectListEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectListEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectListEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
