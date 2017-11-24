import { Component } from '@angular/core';

import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  items: MenuItem[];

  ngOnInit() {
    this.items = [
      { label: 'Stats', icon: 'fa-bar-chart' },
      { label: 'Calendar', icon: 'fa-calendar' },
      { label: 'Documentation', icon: 'fa-book' },
      { label: 'Support', icon: 'fa-support' },
      { label: 'Social', icon: 'fa-twitter' }
    ];
  }
}
