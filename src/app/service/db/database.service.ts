import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  

  async initializeDatabase() {
    try {
      if (Capacitor.getPlatform() === 'web') {
        throw new Error('No soportado en web');
      }

      // Crear conexión a la base de datos
      const db: SQLiteDBConnection = await this.sqlite.createConnection(
        'consulta.db',  // Nombre de la base de datos
        false,         // No está encriptada
        'no-encryption', // Modo de encriptación (aquí sin encriptación)
        1,             // Versión de la base de datos
        false          // No es de solo lectura
      );

      this.db = db; 
    await this.db.open();

    //await this.db.execute('DROP TABLE IF EXISTS Consultas'); 
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS Consultas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipoConsulta TEXT,
        inputValue TEXT,
        fecha TEXT
      )
    `);

  } catch (error) {
    console.error('Error al crear la base de datos:', error);
  }
}

  async saveConsulta(tipoConsulta: string, inputValue: string) {
    const fecha = new Date().toISOString();
    try {
      if (this.db) 
      {
        const query = `INSERT INTO Consultas (tipoConsulta, inputValue, fecha) VALUES (?, ?, ?)`;
        const values = [tipoConsulta, inputValue, fecha];
        await this.db.run(query, values);
      }
      
    } catch (error) 
    {
      console.error('Error al guardar la consulta:', error);
      
    }
  }


  async getAllConsultas(): Promise<any[]> {

    try {

      if (this.db) 
        {
          const query = 'SELECT id, tipoConsulta, inputValue, fecha FROM Consultas ORDER BY fecha DESC';
          const result = await this.db.query(query);
          
          return result.values ? result.values : [];
        }else{
          console.error('Base de datos no inicializada.');
          return [];
        }
      
    } catch (error) {
      console.error('Error al obtener los datos de consulta:', error);
      return [];
    }
    
  }


  async getSearchConsult(valor: string) {
    try {
      if (this.db) {
        const result = await this.db.query(
          'SELECT id FROM Consultas WHERE inputValue = ?',
          [valor]
        );
        // Retorna 1 si hay resultados, de lo contrario 0
        return result.values && result.values.length > 0 ? 1 : 0;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error al obtener los datos de consulta buscar:', error);
      return 0;
    }
  }
  
  
}
