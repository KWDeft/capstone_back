import Router from 'koa-router';
import * as productCtrl from './product.ctrl';
import * as productDetailCtrl from './productDetail.ctrl';

const product = new Router();

product.post('/write', productCtrl.write);
product.get('/list', productCtrl.list);
product.get('/read/:id', productCtrl.read);
product.patch('/:id', productCtrl.update);
product.delete('/:id', productCtrl.remove);
product.get('/productname', productCtrl.getName);

product.post('/detail', productDetailCtrl.detail);
product.get('/detail/:productId', productDetailCtrl.getProducts);
product.delete('/detail/:id', productDetailCtrl.remove);
// product.get('/detail/price/:productId', productDetailCtrl.getPrice);
product.get('/detail/price/:productname', productDetailCtrl.getPrice2);

export default product;
