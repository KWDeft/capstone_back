import Product from "../../models/product";
import Joi from 'joi';

/*
  POST /api/product/write
  {
    name: '상품 이름', 
  }
*/

export const write = async (ctx) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
  });

  //검증과 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if(result.error) {
    ctx.status = 400; //Bad request
    ctx.body = result.error;
    return;
  }

  const {name} = ctx.request.body;
  const product = new Product({
    name
  });

  try{
    await product.save();
    ctx.body = product;
  } catch(e) {
    ctx.throw(500, e);
  }
};

/*
    GET api/product/list
*/

// 모든 일정 불러오기
export const list = async (ctx) => {
    try {
      const products = await Product.find().exec();
      ctx.body = products;
    } catch (e) {
      ctx.throw(500, e)
    }
  };

/*
    GET api/product/read/:id
*/
export const read = async (ctx) => {
    const {id} = ctx.params;
    try {
      const product = await Product.findById(id).exec();
      if(!product) {
        ctx.status = 404; // Not Found
        return;
      }
      ctx.body = product;
    } catch (e) {
      ctx.throw(500, e);
    }
};

/*
    GET api/product/get/:name
*/
export const readByName = async (ctx) => {
  const {name} = ctx.params;
  try {
    const product = await Product.findByName(name).exec();
    if(!product) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = product;
  } catch (e) {
    ctx.throw(500, e);
  }
};
  
/*
    DELETE api/product/:id
*/

export const remove = async (ctx) => {
    const {id} = ctx.params;
    try {
      await Product.findByIdAndRemove(id).exec();
      ctx.status = 204; // No Content (성공했으나 응답할 데이터 없음)
    } catch (e) {
      ctx.throw(500, e);
    }
};
  

/*
    PATCH api/product/:id
*/

export const update = async (ctx) => {
    const {id} = ctx.params;
    // write 에서 사용한 schema와 비슷하나 required()가 없다.
    const schema = Joi.object().keys({
        name: Joi.string()
      });
    // 검증하고 나서 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
      ctx.status = 400; // Bad Request
      ctx.body = result.error;
      return;
    }
    try {
      const product = await Product.findByIdAndUpdate(id, ctx.request.body, {
        new: true, // 업데이트된 데이터 반환
      }).exec();
      if(!product) {
        ctx.status = 404;
        return;
      }
      ctx.body = product;
    } catch(e) {
      ctx.throw(500, e);
    }
};