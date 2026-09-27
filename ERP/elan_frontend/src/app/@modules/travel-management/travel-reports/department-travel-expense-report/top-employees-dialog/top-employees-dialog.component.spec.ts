import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopEmployeesDialogComponent } from './top-employees-dialog.component';

describe('TopEmployeesDialogComponent', () => {
  let component: TopEmployeesDialogComponent;
  let fixture: ComponentFixture<TopEmployeesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopEmployeesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopEmployeesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
