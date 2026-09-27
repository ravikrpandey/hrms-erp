import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationFormDialogComponent } from './declaration-form-dialog.component';

describe('DeclarationFormDialogComponent', () => {
  let component: DeclarationFormDialogComponent;
  let fixture: ComponentFixture<DeclarationFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclarationFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarationFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
