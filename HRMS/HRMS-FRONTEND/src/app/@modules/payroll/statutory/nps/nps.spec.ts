import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nps } from './nps';

describe('Nps', () => {
  let component: Nps;
  let fixture: ComponentFixture<Nps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nps);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
