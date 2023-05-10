import ScheduleAdmin from "../../models/schedule";
import Consumer from "../../models/consumer.info";

import Joi from 'joi';

/*
    POST /api/schedule/admin
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
export const scheduleAdmin = async (ctx) => {
  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검증
    usernum: Joi.number().required(), // required()가 있으면 필수 항목
    manager: Joi.string(),
    name: Joi.string(),
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
  const {name} = await Consumer.findOne({usernum : usernum}).exec();
  // const {manager} = await Consumer.findOne({usernum : usernum}).exec();
  console.log("name : ", name);
  const scheduleAdmin = new ScheduleAdmin({
    usernum,
    manager,
    name, 
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

    const checkconsumer = await ScheduleAdmin.findOne({ usernum : usernum, date : date});
    if (checkconsumer != undefined){
      ctx.status = 400;
      ctx.body = { message: "해당 날짜에 해당 회원의 일정이 이미 존재합니다." };
      return;
    }
  
    const checkmanager = await ScheduleAdmin.findOne({ manager : manager, startHour : startHour, date : date});
    if (checkmanager != undefined){
      ctx.status = 400;
      ctx.body = { message: "해당 시간에 해당 담당자(코치)의 일정이 이미 존재합니다." };
      return;
    }

    await scheduleAdmin.save();
    ctx.body = scheduleAdmin;
  } catch(e) {
    ctx.throw(500, e);
  }
};

/*
    GET api/schedule/admin/list
*/

// 모든 일정 불러오기

export const list = async (ctx) => {
  try {
    const schedules = await ScheduleAdmin.find().exec();
    ctx.body = schedules;
  } catch (e) {
    ctx.throw(500, e)
  }
};
export const read = async (ctx) => {
  const {id} = ctx.params;

  try {
    const schedule = await ScheduleAdmin.findById(id).exec();
    if(!schedule) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = schedule;
  } catch (e) {
    ctx.throw(500, e)
  }
};

/*
    GET api/schedule/admin/usernum/:usernum
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
    GET api/schedule/admin/username/:name
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
    GET api/schedule/admin/manager/:manager
*/
// 담당자 이름으로 해당 담당자의 일정 불러오기
export const managerschedule = async (ctx) => {
  const {manager} = ctx.params;

  try {

    const schedules = await ScheduleAdmin.find({manager : manager}).exec();
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
    PATCH api/schedule/admin/:id
*/

export const update = async (ctx) => {
  const {id} = ctx.params;

  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검증
    usernum: Joi.number(),
    manager: Joi.string(),
    name: Joi.string(),
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
      const schedule = await ScheduleAdmin.findByIdAndUpdate(id, ctx.request.body, {
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
    DELETE api/schedule/admin/:id
*/

export const remove = async (ctx) => {
  const {id} = ctx.params;
  try {
    await ScheduleAdmin.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공했으나 응답할 데이터 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};