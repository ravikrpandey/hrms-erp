import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gratuitycreate } from './gratuitycreate';

describe('Gratuitycreate', () => {
  let component: Gratuitycreate;
  let fixture: ComponentFixture<Gratuitycreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gratuitycreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gratuitycreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
