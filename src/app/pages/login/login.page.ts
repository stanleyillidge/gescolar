import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import anime from 'animejs/lib/anime.es';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';
import { MenuController } from '@ionic/angular';
// import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('box', {static: false}) box: ElementRef;
  ngOnInit(): void {
    this.menuCtrl.enable(false).then((r) => {
      console.log(r);
    });
    this.ngAfterViewInit();
    // throw new Error('Method not implemented.');
  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    setTimeout(() => {
      this.box.nativeElement.classList.add('magictime');
      // this.box.nativeElement.classList.add('puffIn');
      this.box.nativeElement.classList.add('slideDownReturn');
      this.callAnime();
    }, 500);
  }
  constructor(
    private router: Router,
    public menuCtrl: MenuController,
    private authService: AuthService
  ) {}
  ngOnDestroy() {
    this.menuCtrl.enable(true).then((r) => {
      console.log(r);
    });
  }
  callAnime() {
    anime.timeline({loop: false})
    .add({
      targets: '.ml5 .line',
      opacity: [0.5, 1],
      scaleX: [0, 1],
      easing: 'easeInOutExpo',
      duration: 700
    }).add({
      targets: '.ml5 .line',
      duration: 600,
      easing: 'easeOutExpo',
      translateY: (el, i) => (-0.625 + 0.625 * 2 * i) + 'em'
    }).add({
      targets: '.ml5 .letters-left',
      opacity: [0, 1],
      translateX: ['0.5em', 0],
      easing: 'easeOutExpo',
      duration: 600,
      offset: '-=300'
    });
  }
  in() {
    this.authService.login();
    // this.router.navigate(['/home']);
  }
}
