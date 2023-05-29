import Router from 'koa-router';
import * as productCtrl from './product.ctrl';
import * as productDetailCtrl from './productDetail.ctrl';

const product = new Router();

product.post('/write', productCtrl.write);
product.get('/list', productCtrl.list);
product.get('/read/:id', productCtrl.read);
product.get('/get/:name', productCtrl.readByName);
product.patch('/:id', productCtrl.update);
product.delete('/:id', productCtrl.remove);

product.post('/detail', productDetailCtrl.detail);
product.get('/detail/:productId', productDetailCtrl.getProducts);
product.delete('/detail/:id', productDetailCtrl.remove);

export default product;