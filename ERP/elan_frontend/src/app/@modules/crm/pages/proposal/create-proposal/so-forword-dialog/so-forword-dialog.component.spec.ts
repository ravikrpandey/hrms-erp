import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoForwordDialogComponent } from './so-forword-dialog.component';

describe('SoForwordDialogComponent', () => {
  let component: SoForwordDialogComponent;
  let fixture: ComponentFixture<SoForwordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoForwordDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoForwordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
