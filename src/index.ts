import express from 'express';
import { config } from './config/config';
import nasaRoutes from './routes/nasa.routes';
import { PrismaClient } from './generated/prisma';
import cors from 'cors';

class AppServer {
  public app: express.Application;
  private prisma: PrismaClient;

  constructor() {
    this.app = express();
    this.prisma = new PrismaClient();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDatabase();
  }


  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: config.FRONTEND_URL || '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
          'Origin',
        ],
      }),
    );
  }

  private initializeRoutes(): void {
    this.app.use('/api', nasaRoutes);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log('✅ Conexion a la base de datos establecida.');
    } catch (error) {
      console.error('❌ Error al conectarse a la base de datos:', error);
      process.exit(1);
    }
  }

  public listen(): void {
    this.app.listen(config.PORT, () => {
      console.log(`
🚀 =====================================
    Nasa Ia API Server esta corriendo...
    Puerto: ${config.PORT}
    Entorno: ${process.env.NODE_ENV || 'development'}
    Tiempo: ${new Date().toISOString()}
======================================
      `);
    });
  }
}

const server = new AppServer();
server.listen();

export default server.app;
