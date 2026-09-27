import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageStatusComponent } from './language-status.component';

describe('LanguageStatusComponent', () => {
  let component: LanguageStatusComponent;
  let fixture: ComponentFixture<LanguageStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
