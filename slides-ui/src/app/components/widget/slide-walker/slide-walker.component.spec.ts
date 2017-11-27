import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideWalkerComponent } from './slide-walker.component';

describe('SlideWalkerComponent', () => {
  let component: SlideWalkerComponent;
  let fixture: ComponentFixture<SlideWalkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideWalkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideWalkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
