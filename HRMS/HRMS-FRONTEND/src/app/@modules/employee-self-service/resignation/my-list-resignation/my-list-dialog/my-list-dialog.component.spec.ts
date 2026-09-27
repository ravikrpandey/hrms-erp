import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListDialogComponent } from './my-list-dialog.component';

describe('MyListDialogComponent', () => {
  let component: MyListDialogComponent;
  let fixture: ComponentFixture<MyListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
