import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformaComponent } from './performa.component';

describe('PerformaComponent', () => {
  let component: PerformaComponent;
  let fixture: ComponentFixture<PerformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
