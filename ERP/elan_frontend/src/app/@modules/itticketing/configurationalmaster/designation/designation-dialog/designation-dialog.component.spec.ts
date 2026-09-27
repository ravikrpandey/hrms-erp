import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationDialogComponent } from './designation-dialog.component';

describe('DesignationDialogComponent', () => {
  let component: DesignationDialogComponent;
  let fixture: ComponentFixture<DesignationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
