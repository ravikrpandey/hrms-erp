import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangDailogComponent } from './lang-dailog.component';

describe('LangDailogComponent', () => {
  let component: LangDailogComponent;
  let fixture: ComponentFixture<LangDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LangDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
