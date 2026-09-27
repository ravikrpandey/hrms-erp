import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopEmployeesActionComponent } from './top-employees-action.component';

describe('TopEmployeesActionComponent', () => {
  let component: TopEmployeesActionComponent;
  let fixture: ComponentFixture<TopEmployeesActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopEmployeesActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopEmployeesActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
