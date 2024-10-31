import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from "../service/db/database.service";
import { ApiServiceService } from "../service/apiService/api-service.service";
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-my-consult',
  templateUrl: './my-consult.page.html',
  styleUrls: ['./my-consult.page.scss'],
})
export class MyConsultPage implements OnInit {

  @ViewChild('modal2', { static: true }) modal2!: IonModal;

  consultas: any[] = [];
  agrupadas: any[] = [];

  constructor(
    private databaseService: DatabaseService,
    private apiServiceService: ApiServiceService
  ) {

    this.myconsultas();

  }

  ngOnInit() {

    this.myconsultas();
  }

   // Carga las consultas cada vez que se entra a esta página
   ionViewWillEnter() {
    this.myconsultas();
  }

  async myconsultas()
  {
    try {
      this.consultas = [];
      // Obtener los sorteos almacenados en SQLite
      const sorteos = await this.databaseService.getAllConsultas();
      
      // Asegúrate de que siempre se asigna un array, incluso si es vacío
      this.consultas = sorteos || [];
    } catch (error) 
    {
      console.error('Error al obtener la lista consulta desde SQLite', error);
      
    }
  }


  async consultar(tipoConsulta: string, inputValue: string) {

    this.agrupadas = [];
    this.apiServiceService.consultarNotificaciones(tipoConsulta, inputValue)
      .subscribe(response => {
        if (response.resp === 'OK' && response.notificaciones?.length) {

          this.agrupadas = this.agruparPorDia(response.notificaciones[0].detallePlanificacion);

          this.modal2.present();
        } else {
          this.agrupadas = [];
          alert('No se encontraron notificaciones.');
        }
      });
  }


  diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  agruparPorDia(detalles: any[]) {
    const agrupadas = detalles.reduce((acc: any, detalle: any) => {
      const fechaCompleta = detalle.fechaCorte.trim();
      const [diaNombre] = fechaCompleta.split(',').map((part: string) => part.trim());
      
      const diaExistente = acc.find((d: any) => d.fechaCompleta === fechaCompleta);
      if (diaExistente) {
        diaExistente.horarios.push({
          horaDesde: detalle.horaDesde,
          horaHasta: detalle.horaHasta
        });
      } else {
        acc.push({
          dia: diaNombre,
          fechaCompleta: fechaCompleta,
          horarios: [{
            horaDesde: detalle.horaDesde,
            horaHasta: detalle.horaHasta
          }]
        });
      }
      return acc;
    }, []);
    return agrupadas;
  }


}
