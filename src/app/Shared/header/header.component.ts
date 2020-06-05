import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/Services/Authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private sub: any;
  private userID: any;
  public _loadingBar;
  public _showLogo: boolean = true;
  public _title: string = "rien";

  @Input() loginbutton: boolean;

  constructor(private route: ActivatedRoute, private menu: MenuController, private router: Router, private authService: AuthenticationService) { }


  @Input()
  set loadingBar(loadingBar: boolean) {
    this._loadingBar = loadingBar;
  }
  get loadingBar(): boolean { return this._loadingBar; }

  @Input()
  set showLogo(logo: boolean) {
    this._showLogo = logo;
  }
  get showLogo(): boolean { return this._showLogo; }

  @Input()
  set title(title: string) {
    this._title = title;
  }
  get title(): string { return this._title; }

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
    this.router.navigate([params]);
  }

  navigatewithparam(link, param) {
    this.router.navigate([link, param]);
  }

  onLogOut() {
    this.authService.disconnectUser().subscribe(res => {
      this.navigate('/home');
    });
  }
  onLogIn() {
    this.navigate('/login');
  }

  setConfig() {
    this.navigate('/user/1/settings');
  }
}
