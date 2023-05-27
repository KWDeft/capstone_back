import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema({
  pay_amount: String, // 결제 금액
  usernum: Number, // 회원 번호
  product: String, // 상품 이름
  pay_method: String, // 결제 수단
  pay_date: String, // 결제일
});

const PaymentInfo = mongoose.model('PaymentInfo', PaymentSchema);
export default PaymentInfo;
