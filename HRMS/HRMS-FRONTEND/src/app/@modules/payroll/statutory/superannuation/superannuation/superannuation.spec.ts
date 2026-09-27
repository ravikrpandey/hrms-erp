import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Superannuation } from './superannuation';

describe('Superannuation', () => {
  let component: Superannuation;
  let fixture: ComponentFixture<Superannuation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Superannuation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Superannuation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
