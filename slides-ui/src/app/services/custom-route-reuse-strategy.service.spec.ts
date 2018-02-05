import { TestBed, inject } from '@angular/core/testing';

import { CustomRouteReuseStrategyService } from './custom-route-reuse-strategy.service';

describe('CustomRouteReuseStrategyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomRouteReuseStrategyService]
    });
  });

  it('should be created', inject([CustomRouteReuseStrategyService], (service: CustomRouteReuseStrategyService) => {
    expect(service).toBeTruthy();
  }));
});
