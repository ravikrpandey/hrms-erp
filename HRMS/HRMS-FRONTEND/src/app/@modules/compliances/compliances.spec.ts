import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compliances } from './compliances';

describe('Compliances', () => {
  let component: Compliances;
  let fixture: ComponentFixture<Compliances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compliances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Compliances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
