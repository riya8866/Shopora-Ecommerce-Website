import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../material.imports'; // your Angular Material imports
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ...MATERIAL_IMPORTS],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  message: string = '';

 onSubmit() {
    const templateParams = {
      from_name: this.name,
      from_email: this.email,
      message: this.message,
    };

    emailjs.send(
      'service_6gcel8e',      // 🔑 from EmailJS dashboard
      'template_qvh5neu',     // 🔑 from EmailJS dashboard
      templateParams,
      'zXoTzKwY6uQVpSiIY'          // 🔑 public key from EmailJS
    )
    .then((result: EmailJSResponseStatus) => {
      alert('Message sent successfully!');
      this.name = '';
      this.email = '';
      this.message = '';
    }, (error) => {
      console.error('EmailJS error:', error.text);
      alert('Failed to send message. Please try again later.');
    });
  }
  
}
