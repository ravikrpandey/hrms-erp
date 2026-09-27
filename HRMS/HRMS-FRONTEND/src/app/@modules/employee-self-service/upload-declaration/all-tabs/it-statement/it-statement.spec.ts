import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItStatement } from './it-statement';

describe('ItStatement', () => {
  let component: ItStatement;
  let fixture: ComponentFixture<ItStatement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItStatement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItStatement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
