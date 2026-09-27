import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarebifurcationNewComponent } from './warebifurcation-new.component';

describe('WarebifurcationNewComponent', () => {
  let component: WarebifurcationNewComponent;
  let fixture: ComponentFixture<WarebifurcationNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarebifurcationNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarebifurcationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
