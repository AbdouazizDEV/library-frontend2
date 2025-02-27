// src/app/components/home/home.component.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgStyle } from '@angular/common';
import { NavComponent } from '../nav/nav.component'; // Importer NavComponent
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgStyle, NavComponent], // Importer NgStyle et NavComponent
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  mouseX = 0;
  mouseY = 0;

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  get cursorStyle() {
    return {
      transform: `translate(${this.mouseX}px, ${this.mouseY}px)`,
    };
  }
}