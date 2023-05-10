import ScheduleCoach from "../../models/schedule";
import Consumer from "../../models/consumer.info";
import Coach from '../../models/member.coach';


import Joi from 'joi';

/*
    POST /api/schedule/coach
    {
        usernum: '회원번호',
        manager: '수업할코치',
        date: '수업 날짜',
        startHour: '시작 시간 (시)',
        startMinute: '시작 시간 (분)',
        endHour: '종료 시간 (시)',
        endMinute: '종료 시간 (분)',
        memo: '메모',
    }
*/
export const scheduleCoach = async (ctx) => {
  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검증
    usernum: Joi.number().required(), // required()가 있으면 필수 항목
    manager: Joi.string(),
    date: Joi.string().required(),
    startHour: Joi.string().required(),
    startMinute: Joi.string().required(),
    endHour: Joi.string().required(),
    endMinute: Joi.string().required(),
    memo: Joi.string(),
  });

  //검증과 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if(result.error) {
    ctx.status = 400; //Bad request
    ctx.body = result.error;
    return;
  }

  const {usernum, manager, date, startHour, startMinute, endHour, endMinute, memo} = ctx.request.body;
  // const {manager} = await Consumer.findOne({usernum : usernum}).exec();
  const scheduleCoach = new ScheduleCoach({
    usernum, 
    manager,
    date, 
    startHour, 
    startMinute, 
    endHour, 
    endMinute, 
    memo,
  });

  try{
    /* 
        이미 존재하는 일정인지 확인 
    */

    const checkconsumer = await ScheduleCoach.findOne({ usernum : usernum, date : date});
    if (checkconsumer != undefined){
      ctx.status = 400;
      ctx.body = { message: "해당 날짜에 해당 회원의 일정이 이미 존재합니다." };
      return;
    }
  
    const checkmanager = await ScheduleCoach.findOne({ manager : manager, startHour : startHour, date : date});
    if (checkmanager != undefined){
      ctx.status = 400;
      ctx.body = { message: "해당 시간에 일정이 이미 존재합니다." };
      return;
    }

    await scheduleCoach.save();
    ctx.body = scheduleCoach;
  } catch(e) {
    ctx.throw(500, e);
  }
};

/*
    GET api/schedule/coach/list/:manager
*/
// 해당 코치의 모든 일정 불러오기
export const list = async (ctx) => {
  const {manager} = ctx.params;
  console.log("매니저",manager);

  try {

    const schedules = await ScheduleCoach.find({manager : manager}).exec();
    if(!schedules) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = schedules;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET api/schedule/coach/usernum/:usernum
*/
// 회원번호로 검색
export const searchNum = async (ctx) => {
  const {usernum} = ctx.params;
  try {
    const searchUsernum = await Consumer.find({usernum : usernum}).exec();
    if(!searchUsernum) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = searchUsernum;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET api/schedule/coach/username/:name
*/
// 이름으로 검색
export const searchName = async (ctx) => {
  const {name} = ctx.params;
  try {
    const searchUsername = await Consumer.find({name : name}).exec();
    if(!searchUsername) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = searchUsername;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET api/schedule/coach/coachnum/:coachnum
*/
// 코치번호로 일정 가져오기
export const listwithcoachnum = async (ctx) => {
  const {coachnum} = ctx.params;
  console.log("하,.",coachnum);

  const {name} = await Coach.findOne({coachnum:coachnum}).exec();
  console.log("이거야",name);
  try {
    const schedules = await ScheduleCoach.find({manager : name}).exec();
    console.log(schedules);
    if(!schedules) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = schedules;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    PATCH api/schedule/coach/:id
*/

export const update = async (ctx) => {
  const {id} = ctx.params;

  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검증
    usernum: Joi.number(),
    manager: Joi.string(),
    date: Joi.string(),
    startHour: Joi.string(),
    startMinute: Joi.string(),
    endHour: Joi.string(),
    endMinute: Joi.string(),
    memo: Joi.string(),
    completeCheck: Joi.string(),
  });

    // 검증하고 나서 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
      ctx.status = 400; // Bad Request
      ctx.body = result.error;
      return;
    }
    try {
      
      const schedule = await ScheduleCoach.findByIdAndUpdate(id, ctx.request.body, {
        new: true, // 업데이트된 데이터 반환
      }).exec();
      if(!schedule) {
        ctx.status = 404;
        return;
      }
      ctx.body = schedule;
    } catch(e) {
      ctx.throw(500, e);
    } 
}


/*
    DELETE api/schedule/coach/:id
*/

export const remove = async (ctx) => {
  const {id} = ctx.params;
  try {
    await ScheduleCoach.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공했으나 응답할 데이터 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};