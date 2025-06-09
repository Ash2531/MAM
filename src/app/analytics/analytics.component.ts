import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {
  topProducts = [
    { name: 'Product A', sales: '1,234', growth: '+12%', icon: 'shopping_bag' },
    { name: 'Product B', sales: '956', growth: '+8%', icon: 'laptop' },
    { name: 'Product C', sales: '789', growth: '+5%', icon: 'headphones' },
    { name: 'Product D', sales: '645', growth: '+3%', icon: 'watch' }
  ];

  metrics = [
    { name: 'Revenue Growth', value: '84%', percentage: 84 },
    { name: 'Customer Satisfaction', value: '92%', percentage: 92 },
    { name: 'Market Share', value: '67%', percentage: 67 },
    { name: 'User Engagement', value: '78%', percentage: 78 }
  ];
}
