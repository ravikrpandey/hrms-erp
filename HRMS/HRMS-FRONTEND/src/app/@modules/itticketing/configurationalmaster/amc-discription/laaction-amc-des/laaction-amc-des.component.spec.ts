import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaactionAmcDesComponent } from './laaction-amc-des.component';

describe('LaactionAmcDesComponent', () => {
  let component: LaactionAmcDesComponent;
  let fixture: ComponentFixture<LaactionAmcDesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaactionAmcDesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaactionAmcDesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
