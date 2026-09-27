import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeActionComponent } from './scheme-action.component';

describe('SchemeActionComponent', () => {
  let component: SchemeActionComponent;
  let fixture: ComponentFixture<SchemeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
