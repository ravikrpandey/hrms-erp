import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpaActionComponent } from './kpa-action.component';

describe('KpaActionComponent', () => {
  let component: KpaActionComponent;
  let fixture: ComponentFixture<KpaActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpaActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpaActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
