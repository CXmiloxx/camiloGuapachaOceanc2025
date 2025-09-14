import { config } from '../config/config';
import { AxiosService } from './axios.services';

export class NasaService {
  private readonly axiosService: AxiosService;
  private readonly API_URL: string;

  constructor() {
    this.axiosService = new AxiosService();
    this.API_URL = `https://api.nasa.gov/insight_weather/?api_key=${config.NASA_API_KEY}&feedtype=json&ver=1.0`;
  }

  public async fetchAllData() {
    try {
      const response = await this.axiosService.get(this.API_URL);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch NASA data: ${error}`);
    }
  }
}
