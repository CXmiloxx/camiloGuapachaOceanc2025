import axios from 'axios';
export class AxiosService {
  async get(url: string) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      console.error(`Error en GET request: ${error.message}`);
      throw new Error('Error en GET request');
    }
  }
}
