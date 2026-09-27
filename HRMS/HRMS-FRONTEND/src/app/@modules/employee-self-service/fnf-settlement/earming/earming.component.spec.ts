import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarmingComponent } from './earming.component';

describe('EarmingComponent', () => {
  let component: EarmingComponent;
  let fixture: ComponentFixture<EarmingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarmingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
