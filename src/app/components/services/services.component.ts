import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { Service } from 'src/app/model/service.model';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  public services:Service[] = [];
  constructor(public fireBaseService: FirebaseService) { }

  ngOnInit(): void {
    this.retrieveServiceInfo();
  }
  public async retrieveServiceInfo() {
    this.services = await this.fireBaseService.getServiceInfo();
  }
  public arrayOne(n: number): any[] {
    return Array(n);
  }
}
