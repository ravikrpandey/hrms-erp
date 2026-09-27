import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareCreate } from './welfare-create';

describe('WelfareCreate', () => {
  let component: WelfareCreate;
  let fixture: ComponentFixture<WelfareCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelfareCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelfareCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
