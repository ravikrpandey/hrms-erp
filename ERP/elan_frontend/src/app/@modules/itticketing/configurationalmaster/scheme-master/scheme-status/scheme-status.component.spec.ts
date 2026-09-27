import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeStatusComponent } from './scheme-status.component';

describe('SchemeCreateNewComponent', () => {
  let component: SchemeStatusComponent;
  let fixture: ComponentFixture<SchemeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
