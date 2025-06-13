import { Router } from 'express';
import {
  addBlock,
  listAllBlocks} from '../controllers/blockchain-contollers.mjs';
  


const routes = Router();

routes.get('/', listAllBlocks);
routes.post('/mine', addBlock);

export default routes;
