import ProductDetail from '../../models/productDetail';
import Product from '../../models/product';
import Joi from 'joi';

/*
    POST /api/product/detail
    {
        count: '',
        price: '',
        productId: '',
    }
*/
export const detail = async (ctx) => {
  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검증
    count: Joi.string().required(), // required()가 있으면 필수 항목
    price: Joi.string().required(),
    productId: Joi.string().required(),
  });

  //검증과 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; //Bad request
    ctx.body = result.error;
    return;
  }

  const { count, price, productId } = ctx.request.body;
  const detail = new ProductDetail({
    count,
    price,
    productId,
  });
  try {
    await detail.save();
    ctx.body = detail;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    Get  /api/product/detail/:productId
*/
export const getProducts = async (ctx) => {
  const { productId } = ctx.params;

  try {
    const post = await ProductDetail.find({ productId: productId }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
      DELETE /api/product/detail/:id
  */
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await ProductDetail.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공했으나 응답할 데이터 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET /api/product/detail/price/:productId
*/
export const getPrice = async (ctx) => {
  let priceArr = [];

  const { productId } = ctx.params;

  try {
    const post = await ProductDetail.find({ productId: productId }).exec();
    const product = await Product.findById(productId).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }

    if (!product) {
      ctx.status = 404; // Not Found
      return;
    }

    for (let i = 0; i < post.length; i++) {
      var value = product.name + '-' + post[i].price;
      // priceArr.push(post[i].price);
      priceArr.push(value);
    }

    // console.log(priceArr.length);

    ctx.body = priceArr;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET /api/product/detail/price/:productname
*/
export const getPrice2 = async (ctx) => {
  let priceArr = [];

  const { productname } = ctx.params;

  try {
    const product = await Product.find({ name: productname }).exec();

    if (!product) {
      ctx.status = 404; // Not Found
      return;
    }

    for (let i = 0; i < product.length; i++) {
      const post = await ProductDetail.find({
        productId: product[i]._id,
      }).exec();

      if (!post) {
        ctx.status = 404;
        return;
      }

      for (let i = 0; i < post.length; i++) {
        priceArr.push(post[i].price);
      }
    }

    ctx.body = priceArr;
  } catch (e) {
    ctx.throw(500, e);
  }
};
