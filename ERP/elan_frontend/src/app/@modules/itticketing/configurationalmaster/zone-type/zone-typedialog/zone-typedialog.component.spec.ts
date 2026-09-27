import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneTypedialogComponent } from './zone-typedialog.component';

describe('ZoneTypedialogComponent', () => {
  let component: ZoneTypedialogComponent;
  let fixture: ComponentFixture<ZoneTypedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneTypedialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneTypedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
