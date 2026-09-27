import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsesStatusComponent } from './uses-status.component';

describe('UsesStatusComponent', () => {
  let component: UsesStatusComponent;
  let fixture: ComponentFixture<UsesStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsesStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsesStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
