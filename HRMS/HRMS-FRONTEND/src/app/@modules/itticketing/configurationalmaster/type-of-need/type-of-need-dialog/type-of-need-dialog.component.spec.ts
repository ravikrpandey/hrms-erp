import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfNeedDialogComponent } from './type-of-need-dialog.component';

describe('TypeOfNeedDialogComponent', () => {
  let component: TypeOfNeedDialogComponent;
  let fixture: ComponentFixture<TypeOfNeedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfNeedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfNeedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
