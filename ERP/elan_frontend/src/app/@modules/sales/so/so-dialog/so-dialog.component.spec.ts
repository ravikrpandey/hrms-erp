import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoDialogComponent } from './so-dialog.component';

describe('SoDialogComponent', () => {
  let component: SoDialogComponent;
  let fixture: ComponentFixture<SoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
