import fp from 'fastify-plugin';
import DB from '../utils/DB/DB';
import { DBApi } from '../utils/DB/DBApi';

export default fp(async (fastify): Promise<void> => {
  const db = new DB();
  fastify.decorate('db', db);
  const adb = new DBApi(db);
  fastify.decorate('adb', adb);
});

declare module 'fastify' {
  export interface FastifyInstance {
    db: DB;
    adb: DBApi;
  }
}
