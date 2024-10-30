import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../service/db/database.service";

@Component({
  selector: 'app-my-consult',
  templateUrl: './my-consult.page.html',
  styleUrls: ['./my-consult.page.scss'],
})
export class MyConsultPage implements OnInit {

  consultas: any = [];

  constructor(private databaseService: DatabaseService) {}

  async ngOnInit() {
    this.consultas = await this.databaseService.getAllConsultas();
  }

}
