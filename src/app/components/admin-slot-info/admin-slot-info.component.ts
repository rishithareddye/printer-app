import { Component, OnInit } from '@angular/core';
import TinyDatePicker from 'tiny-date-picker';
import { FirebaseService } from '../../service/firebase.service';
import { Service } from '../../model/service.model';

@Component({
  selector: 'app-admin-slot-info',
  templateUrl: './admin-slot-info.component.html',
  styleUrls: ['./admin-slot-info.component.css']
})
export class AdminSlotInfoComponent implements OnInit {
  services: Service[] = [];
  slots: any[] = [];
  constructor(public fireBaseService: FirebaseService) { }

  ngOnInit(): void {
    this.fireBaseService.getService().then((services)=>{
      this.services = services;
    })
    TinyDatePicker('#slot-info-date', {
      mode: 'dp-below', format(date) {
        return date.toLocaleDateString();
      }
    });
  }
  async getSlot() {
    var date = (document.getElementById("slot-info-date") as HTMLInputElement).value;
    this.slots = await this.fireBaseService.getSpecificSlot(date);
    if (this.slots.length > 0 && this.services.length == 0) {
      this.services = await this.fireBaseService.getService();
    }
    console.log(this.slots);
    console.log(this.services);
  }
  getKeys(map){
    return Array.from(map.keys());
}
}
