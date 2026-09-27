import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationFormListComponent } from './declaration-form-list.component';

describe('DeclarationFormListComponent', () => {
  let component: DeclarationFormListComponent;
  let fixture: ComponentFixture<DeclarationFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclarationFormListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarationFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
