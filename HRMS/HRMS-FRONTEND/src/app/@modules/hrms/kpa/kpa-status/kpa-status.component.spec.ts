import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpaStatusComponent } from './kpa-status.component';

describe('KpaStatusComponent', () => {
  let component: KpaStatusComponent;
  let fixture: ComponentFixture<KpaStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpaStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpaStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
