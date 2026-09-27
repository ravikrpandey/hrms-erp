import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsSectionsComponent } from './tds-sections.component';

describe('TdsSectionsComponent', () => {
  let component: TdsSectionsComponent;
  let fixture: ComponentFixture<TdsSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsSectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdsSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
