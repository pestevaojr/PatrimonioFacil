import { Component, OnInit } from '@angular/core';
import { Bem } from '../bem';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bens',
  templateUrl: './bens.page.html',
  styleUrls: ['./bens.page.scss'],
})
export class BensPage implements OnInit {

  bens: Bem[] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.bens = this.router.getCurrentNavigation().extras.state.bens;
      }
    });
  }

  get bensConferidos(): Bem[] {
    return this.bens.filter(bem => bem.conferido);
  }

  get qtdeBensConferidos() {
    return this.bensConferidos.length;
  }

  get todosBens(): Bem[] {
    return this.bens;
  }

  get qtdeTotalBens() {
    return this.todosBens.length;
  }

}
