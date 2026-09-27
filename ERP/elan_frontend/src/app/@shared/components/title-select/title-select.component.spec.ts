import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleSelectComponent } from './title-select.component';

describe('TitleSelectComponent', () => {
  let component: TitleSelectComponent;
  let fixture: ComponentFixture<TitleSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
