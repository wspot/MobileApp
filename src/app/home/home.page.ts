import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {

    // this.storage.get('token').then(resolved => {
    //   if (resolved == null) {
    //     this.token = null;
    //   } else {
    //     this.token = resolved;
    //     this.navigate('/user/1');
    //   }
    // });
  }

  navigate(params) {
    this.router.navigate([params]);
  }

}
