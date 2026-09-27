import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRequestDialogComponent } from './my-request-dialog.component';

describe('MyRequestDialogComponent', () => {
  let component: MyRequestDialogComponent;
  let fixture: ComponentFixture<MyRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRequestDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
