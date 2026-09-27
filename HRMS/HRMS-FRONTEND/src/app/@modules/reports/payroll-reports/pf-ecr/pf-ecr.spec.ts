import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfEcr } from './pf-ecr';

describe('PfEcr', () => {
  let component: PfEcr;
  let fixture: ComponentFixture<PfEcr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PfEcr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfEcr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
