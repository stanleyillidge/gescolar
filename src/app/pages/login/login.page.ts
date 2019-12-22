import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import anime from 'animejs/lib/anime.es';
// import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements AfterViewInit {
  
  @ViewChild('box', {static: false}) box: ElementRef;
  
  constructor() { 
    // console.log('constr')
    // this.callAnime()
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    // setTimeout(() => {
    //   console.log("Async Callback");
    //   callBack();
    // }, 1500);
    this.box.nativeElement.classList.add('magictime');
    // this.box.nativeElement.classList.add('puffIn');
    this.box.nativeElement.classList.add('slideDownReturn');
    this.callAnime()
  }
  
  callAnime() {
    anime.timeline({loop: false})
    .add({
      targets: '.ml5 .line',
      opacity: [0.5,1],
      scaleX: [0, 1],
      easing: "easeInOutExpo",
      duration: 700
    }).add({
      targets: '.ml5 .line',
      duration: 600,
      easing: "easeOutExpo",
      translateY: (el, i) => (-0.625 + 0.625*2*i) + "em"
    }).add({
      targets: '.ml5 .letters-left',
      opacity: [0,1],
      translateX: ["0.5em", 0],
      easing: "easeOutExpo",
      duration: 600,
      offset: '-=300'
    })
  }
}
