import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWayDialogComponent } from './e-way-dialog.component';

describe('EWayDialogComponent', () => {
  let component: EWayDialogComponent;
  let fixture: ComponentFixture<EWayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EWayDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EWayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
