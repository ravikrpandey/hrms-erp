import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationFormActionComponent } from './declaration-form-action.component';

describe('DeclarationFormActionComponent', () => {
  let component: DeclarationFormActionComponent;
  let fixture: ComponentFixture<DeclarationFormActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclarationFormActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarationFormActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
