import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaactionLangComponent } from './laaction-lang.component';

describe('LaactionLangComponent', () => {
  let component: LaactionLangComponent;
  let fixture: ComponentFixture<LaactionLangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaactionLangComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaactionLangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
