import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {ConfigService} from '@nestjs/config'; // Importar ConfigService

@Injectable()
export class GeocodingService {
  private apiKey: string;

  constructor(private configService: ConfigService) {
    // Acceder a la clave de la API desde las variables de entorno
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');

    if (!apiKey) {
      throw new Error(
        'API Key de Google Maps no definida en las variables de entorno.'
      );
    }

    this.apiKey = apiKey;
  }

  async obtenerCoordenadas(
    direccion: string
  ): Promise<{lat: number; lng: number} | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${this.apiKey}`;
    console.log('URL de Google Maps:', url);

    try {
      const response = await axios.get(url);
      console.log('URL de Google Maps:', url);

      console.log('Google Maps Response:', response.data);
      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        return {lat: location.lat, lng: location.lng};
      } else {
        console.error(
          'Error geocodificando la dirección:',
          response.data.status
        );
        return null;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return null;
    }
  }
}
