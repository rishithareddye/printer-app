import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { Service } from 'src/app/model/service.model';
import { Option } from 'src/app/model/option.model';
declare var UIkit: any;

@Component({
  selector: 'app-admin-services-info',
  templateUrl: './admin-services-info.component.html',
  styleUrls: ['./admin-services-info.component.css']
})
export class AdminServicesInfoComponent implements OnInit {

  constructor(public fireBaseService: FirebaseService) { }
  services: any[] = [];
  selectedService: Service;
  selectedOption: Option;
  selectedOptionIndex: number = -1;
  selectedServiceIndex: number = -1;
  updateservicesimage: boolean = false;
  ngOnInit(): void {
    this.fireBaseService.getServices().subscribe((services) => {
      this.services = this.snapshotToArray(services);
      console.log(services);
    });
  }
  snapshotToArray(snapshot): Service[] {
    var returnArr = [];
    for (let key in snapshot) {
      var item = snapshot[key];
      item.pushid = key;
      returnArr.push(snapshot[key] as Service);
    }
    return returnArr;
  }
  selectService(service: any,index: any, newservice?) {
    if(newservice == true) {
      this.selectedService = {
        assets: [],
        description:"",
        id: "service_"+Date.parse(new Date().toString()),
        name: "",
        options: []
      }
    this.selectedServiceIndex = this.services.length;
    }
    else {
      this.selectedService = service as Service;
      this.selectedServiceIndex = index;
    }
    UIkit.modal('#selected-service').show();
  }
  public async onFileSelected(event) {
    try {
      if (event.target.files.length > 0) {
        var file: File = event.target.files[0] as File;
        var fileName = "service-asset-1" + file.name.split('.').pop();
        await this.fireBaseService.DeleteDocument(this.selectedService.assets[0]);
        this.selectedService.assets[0] = await this.fireBaseService.UploadDocument(file, "services", fileName);
        UIkit.notification({ message: 'Image Updated.', status: 'success' });
      }
    }
    catch (e) {
      UIkit.notification({ message: 'Image update failed.', status: 'danger' });
    }
  }
  optionSelected(option,index,newtemplate?) {
    if(newtemplate == true) {
      this.selectedOption = {
        assets: [],
        cost: 0,
        maxcount: 0,
        mincount: 0,
        description:"",
        name: "",
        optionid: "template_"+Date.parse(new Date().toString()),
        serviceid: this.selectedService.id
      };
      this.selectedOptionIndex = this.services.length;
    }
    else {
      this.selectedOption = option as Option;
      this.selectedOptionIndex = index;
    }
    UIkit.modal('#view-options').show();
  }
  async deleteAsset(asset) {
    await this.fireBaseService.DeleteDocument(asset);
    var index = this.selectedOption.assets.indexOf(asset);
    this.selectedOption.assets.splice(index, 1);
  }
  async addOptionAsset(event) {
    try {
      if (event.target.files.length > 0) {
        var file: File = event.target.files[0] as File;
        await this.fireBaseService.DeleteDocument(this.selectedService.assets[0]);
        this.selectedOption.assets.push(await this.fireBaseService.UploadDocument(file, "templates", Date.parse(new Date().toString())+file.name));
        UIkit.notification({ message: 'Image Added.', status: 'success' });
      }
    }
    catch (e) {
      UIkit.notification({ message: 'Image Add failed.', status: 'danger' });
    }
  }
  async saveService() {
    try{
      if(this.selectedOptionIndex >= 0) {
        this.selectedService.options[this.selectedOptionIndex] = this.selectedOption;
      }
      await this.fireBaseService.addService(this.selectedService);
      UIkit.notification({ message: 'Saved', status: 'success' });
    }
    catch(e) {
      UIkit.notification({ message: 'Save Failed.', status: 'danger' });
    }
  }
  optionSelectedParentCall(service,serviceindex,option,optionindex) {
      this.selectedOption = option as Option;
      this.selectedOptionIndex = optionindex;
      this.selectedService = service as Service;
      this.selectedServiceIndex = serviceindex;
      UIkit.modal('#view-options').show();
  }
}
