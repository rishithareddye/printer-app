import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { Service } from 'src/app/model/service.model';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  public services:Service[] = [];
  constructor(public fireBaseService: FirebaseService) { }

  ngOnInit(): void {
    this.retrieveServiceInfo();
  }
  public async retrieveServiceInfo() {
    this.services = await this.fireBaseService.getServiceInfo();
  }

}
