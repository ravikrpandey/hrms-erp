import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManpowerRequestDialogComponent } from './manpower-request-dialog.component';

describe('ManpowerRequestDialogComponent', () => {
  let component: ManpowerRequestDialogComponent;
  let fixture: ComponentFixture<ManpowerRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManpowerRequestDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManpowerRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
