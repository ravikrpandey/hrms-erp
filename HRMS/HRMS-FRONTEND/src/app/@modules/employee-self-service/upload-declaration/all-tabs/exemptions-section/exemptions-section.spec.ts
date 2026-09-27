import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemptionsSection } from './exemptions-section';

describe('ExemptionsSection', () => {
  let component: ExemptionsSection;
  let fixture: ComponentFixture<ExemptionsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExemptionsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExemptionsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
