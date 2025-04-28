import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesMoreOptionComponent } from './tiles-more-option.component';

describe('TilesMoreOptionComponent', () => {
  let component: TilesMoreOptionComponent;
  let fixture: ComponentFixture<TilesMoreOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TilesMoreOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TilesMoreOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
