import { Component } from '@angular/core';
import { ApiServiceService } from '../service/apiService/api-service.service';
import { DatabaseService } from "../service/db/database.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  inputValue = '';
  tipoConsulta = '';
  agrupadas: any[] = [];

  constructor(
    private notificacionesService: ApiServiceService,
    private databaseService: DatabaseService
  ) {}

  async consultar() {
    this.notificacionesService.consultarNotificaciones(this.tipoConsulta, this.inputValue)
      .subscribe(response => {
        if (response.resp === 'OK' && response.notificaciones?.length) {
          //guardar consulta
          this.databaseService.saveConsulta(this.tipoConsulta, this.inputValue);

          this.agrupadas = this.agruparPorDia(response.notificaciones[0].detallePlanificacion);
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
