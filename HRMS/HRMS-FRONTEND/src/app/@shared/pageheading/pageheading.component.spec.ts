import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageheadingComponent } from './pageheading.component';

describe('PageheadingComponent', () => {
  let component: PageheadingComponent;
  let fixture: ComponentFixture<PageheadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageheadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageheadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
