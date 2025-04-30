import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  features = [
    {
      title: 'Task Management',
      description: 'Organize and monitor team workflow efficiently.'
    },
    {
      title: 'Team Collaboration',
      description: 'Communicate in real-time, share updates and ideas seamlessly with your team.'
    },
    {
      title: 'Project Analytics',
      description: 'Track project progress and get real-time updates on milestones.'
    }
  ];

  testimonial = {
    name: 'Emily Johnson',
    role: 'Senior Product Manager at TechFlow',
    comment: 'Product Manager Pro has transformed the way I organize my projects. It\'s intuitive and saves me hours every week!',
    rating: 5
  };
}
