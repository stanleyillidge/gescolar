import { Component, OnInit } from '@angular/core';
import anime from 'animejs/lib/anime.es';
// import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  constructor() { 
    // console.log('constr')
    // this.callAnime()
  }

  ngOnInit() {
    console.log('ngOnInit')
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
