import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSection } from './other-section';

describe('OtherSection', () => {
  let component: OtherSection;
  let fixture: ComponentFixture<OtherSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
