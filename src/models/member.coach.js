import mongoose, { Schema } from 'mongoose';

const CoachSchema = new Schema({
  name: String, // 이름
  phone: String, // 전화번호
  email: String, // 이메일
  username: String, // 아이디
  password: String, // 비밀번호
  job: String, // 직무
  record: String, // 이력
  coachnum: String, // 코치 번호
});

const Coach = mongoose.model('Coach', CoachSchema);
export default Coach;
