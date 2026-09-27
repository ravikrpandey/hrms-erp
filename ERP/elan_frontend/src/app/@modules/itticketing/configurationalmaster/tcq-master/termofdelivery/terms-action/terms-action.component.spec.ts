import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsActionComponent } from './terms-action.component';

describe('TermsActionComponent', () => {
  let component: TermsActionComponent;
  let fixture: ComponentFixture<TermsActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
