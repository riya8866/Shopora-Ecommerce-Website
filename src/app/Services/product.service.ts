import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Product{
    id:number;
    title:string;
    price:number;
    description:string;
    category:string;
    image:string;
    rating:{rate:number; count:number};
}

 @Injectable({
        providedIn:'root',
    })
    
export class ProductService{
    private apiUrl = "https://fakestoreapi.com/products";
    constructor(private http:HttpClient){}

    //http=inject(HttpClient)
    getProducts(): Observable<Product[]>{
        return this.http.get<Product[]>(this.apiUrl);
    }

    getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}