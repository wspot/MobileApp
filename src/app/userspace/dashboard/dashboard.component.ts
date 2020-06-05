import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public sub: any;
  public userID: any;

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userID = params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleMenu() {
    // this.menu.enable(true, "MainMenu");      enable the menu later
    this.menu.toggle();
  }

  navigate(params) {
    this.router.navigateByUrl(params);
  }

  navigatewithparam(link, param) {
    this.router.navigate([link, param]);
  }

}
