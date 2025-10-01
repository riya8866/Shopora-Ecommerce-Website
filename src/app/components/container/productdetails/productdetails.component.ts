import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../Services/product.service';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { AddtocartbuttonComponent } from '../../cart/addtocartbutton/addtocartbutton.component';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS, RouterModule,AddtocartbuttonComponent],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.css'
})
export class ProductdetailsComponent {
  product: any;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe(data => {
        this.product = data;
      });
    }
  }

  }

