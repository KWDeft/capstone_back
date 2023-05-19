import mongoose, { Schema } from 'mongoose';

const ScheduleSchema = new Schema({
  usernum: Number,        // 회원번호
  manager: String,        // 담당자명
  name: String,
  date: String,           // 수업 날짜
  startHour: String,      // 수업 시작 시간 (시)
  startMinute: String,    // 수업 시작 시간 (분)
  // endHour: String,        // 수업 종료 시간 (시)
  // endMinute: String,      // 수업 종료 시간 (시)
  memo: String,           // 기타 메모
  completeCheck: String,  // 수업 진행 여부 (완료/미완료),
  
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;