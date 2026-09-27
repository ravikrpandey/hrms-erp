import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqualRemuneration } from './equal-remuneration';

describe('EqualRemuneration', () => {
  let component: EqualRemuneration;
  let fixture: ComponentFixture<EqualRemuneration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EqualRemuneration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EqualRemuneration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
