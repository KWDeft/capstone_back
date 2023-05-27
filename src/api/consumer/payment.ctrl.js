import Joi from 'joi';
import Payment from '../../models/payment.info';

/*
    GET /api/consumer/payment
*/
export const list = async (ctx) => {
  try {
    const posts = await Payment.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/consumer/payment/create
  {
    pay_amount: "135,000", //결제 금액
    usernum: 123, //회원번호
    product: "상품 이름", //상품이름
    pay_method: "계좌이체", //결제 정보
    pay_date: "2023-01-01" //결제일시
  }
*/
export const Create = async (ctx) => {
  // Request Body 검증하기
  // 필수: pay_amount, product, pay_method, usernum, pay_date
  const schema = Joi.object().keys({
    pay_amount: Joi.string().required(), // 결제 금액
    product: Joi.string().required(), // 상품 이름
    pay_method: Joi.string().required(), // 지불 방법
    usernum: Joi.number().required(), // 회원 번호
    pay_date: Joi.string().required(), // 결제 날짜
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { pay_amount, product, pay_method, usernum, pay_date } =
    ctx.request.body;
  try {
    const post = new Payment({
      pay_amount: pay_amount,
      product: product,
      pay_method: pay_method,
      usernum: usernum,
      pay_date: pay_date,
    });

    await post.save(); // 데이터베이스에 저장

    ctx.body = ctx.request.body;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET /api/consumer/payment/:id
*/
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Payment.findById(id).exec();
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
    DELETE /api/consumer/payment/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Payment.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    PATCH /api/consumer/payment/:id
    {
        title: '수정',
        body: '수정 내용',
        tags: ['수정', '태그']
    }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Payment.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
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
    Get  /api/consumer/payment/user/:usernum
    (예. /api/consumer/payment/user/123)
*/
export const userPayment = async (ctx) => {
  const { usernum } = ctx.params;

  try {
    const post = await Payment.find({ usernum: usernum }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
