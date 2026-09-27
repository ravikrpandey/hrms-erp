import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationRequestDialogComponent } from './resignation-request-dialog.component';

describe('ResignationRequestDialogComponent', () => {
  let component: ResignationRequestDialogComponent;
  let fixture: ComponentFixture<ResignationRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResignationRequestDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResignationRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
