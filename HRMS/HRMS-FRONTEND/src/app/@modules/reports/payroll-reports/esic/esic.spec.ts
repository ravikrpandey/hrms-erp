import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Esic } from './esic';

describe('Esic', () => {
  let component: Esic;
  let fixture: ComponentFixture<Esic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Esic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Esic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
