import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,...MATERIAL_IMPORTS, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
