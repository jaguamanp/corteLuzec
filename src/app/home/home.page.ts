import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServiceService } from '../service/apiService/api-service.service';
import { DatabaseService } from "../service/db/database.service";
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit{
  inputValue = '';
  tipoConsulta = '';
  agrupadas: any[] = [];
  @ViewChild('modal1', { static: true }) modal1!: IonModal;

  presentingElement : Element | null = null;

  constructor(
    private notificacionesService: ApiServiceService,
    private databaseService: DatabaseService
  ) {}


  ngOnInit(): void {
    this.presentingElement = document.querySelector('.ion-page');
  }

  async consultar() {
    this.notificacionesService.consultarNotificaciones(this.tipoConsulta, this.inputValue)
      .subscribe(async (response) => { // Cambiar aquí a `async (response)`
        if (response.resp === 'OK' && response.notificaciones?.length) {
          // Usamos await para esperar el resultado de `getSearchConsult`
          let existeConsulta = await this.databaseService.getSearchConsult(this.inputValue);
  
          console.log("existeConsulta: "+existeConsulta);
          if (existeConsulta === 0) {
            // Guarda la consulta ya que no existe
            await this.databaseService.saveConsulta(this.tipoConsulta, this.inputValue);
          }
          
          this.agrupadas = this.agruparPorDia(response.notificaciones[0].detallePlanificacion);
  
          this.modal1.present();
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



  validateNumber(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Permitir solo números
    this.inputValue = input.value; // Actualizar el modelo con el valor filtrado
  }
}
