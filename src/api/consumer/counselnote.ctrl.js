import Joi from 'joi';
// import Info from '../../models/consumer.info';
import CounselNote from '../../models/consumer.note.counsel';

/*
    GET /api/consumer/note/counsel
*/
export const list = async (ctx) => {
  try {
    const posts = await CounselNote.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/consumer/note/counsel/create
  {
    usernum: 123,
    purpose: "커리큘럼 설명",
    manager: "김코치",
    method: "전화 상담",
    reception: "접수 상태 작성",
    detail: "어떤 커리큘럼이 있는지 여쭤보심",
    date_counsel: "2023-01-18",
    ndate_counsel: "2023-01-19",
    attachment_counsel: "첨부파일"
  }
*/
export const Create = async (ctx) => {
  // Request Body 검증하기
  // 필수: name, manager, method, detail / 선택: purpose, reception
  const schema = Joi.object().keys({
    usernum: Joi.number().required(), // 회원 이름
    purpose: Joi.string(), // 목적
    manager: Joi.string().required(), // 담당자
    method: Joi.string().required(), // 상담 방법
    reception: Joi.string(), // 접수 상태
    detail: Joi.string().required(), // 상담 내용
    date_counsel: Joi.string(), // 상담 날짜
    ndate_counsel: Joi.string(), // 다음 상담 날짜
    attachment_counsel: Joi.array().items(Joi.string()), // 첨부파일
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    usernum,
    purpose,
    manager,
    method,
    reception,
    detail,
    date_counsel,
    ndate_counsel,
    attachment_counsel,
  } = ctx.request.body;
  try {
    const post = new CounselNote({
      usernum: usernum,
      purpose: purpose,
      manager: manager,
      method: method,
      reception: reception,
      detail: detail,
      date_counsel: date_counsel,
      ndate_counsel: ndate_counsel,
      attachment_counsel: attachment_counsel,
    });

    await post.save(); // 데이터베이스에 저장

    ctx.body = ctx.request.body;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET /api/consumer/note/counsel/:id
*/
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await CounselNote.findById(id).exec();
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
    DELETE /api/consumer/note/counsel/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await CounselNote.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    PATCH /api/consumer/note/counsel/:id
    {
        title: '수정',
        body: '수정 내용',
        tags: ['수정', '태그']
    }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await CounselNote.findByIdAndUpdate(id, ctx.request.body, {
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
    Get  /api/consumer/note/counsel/user/:usernum
    (예. /api/consumer/note/counsel/user/123)
*/
export const userCounsel = async (ctx) => {
  const { usernum } = ctx.params;

  try {
    const post = await CounselNote.find({ usernum: usernum }).exec();
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
    PATCH /api/consumer/note/counsel/upload/:id
    {
      file: ,
      file: 
    }
*/
export const UploadCounselfile = async (ctx) => {
  const { name } = ctx.request.body;
  console.log('body 데이터 : ', name);

  var paths = [];

  //배열 형태이기 때문에 반복문을 통해 파일 정보를 알아낸다.
  ctx.request.files.map((data) => {
    console.log('폼에 정의된 필드명 : ', data.fieldname);
    console.log('사용자가 업로드한 파일 명 : ', data.originalname);
    console.log('파일의 엔코딩 타입 : ', data.encoding);
    console.log('파일의 Mime 타입 : ', data.mimetype);
    console.log('파일이 저장된 폴더 : ', data.destination);
    console.log('destinatin에 저장된 파일 명 : ', data.filename);
    console.log('업로드된 파일의 전체 경로 ', data.path);
    console.log('파일의 바이트(byte 사이즈)', data.size);

    paths.push(data.path);
  });

  ctx.body = {
    ok: true,
    data: 'Counselnote File Upload Ok',
    path: paths,
  };

  console.log(paths);

  const { id } = ctx.params;
  try {
    const post = await CounselNote.updateOne(
      { _id: id },
      { $set: { attachment_counsel: paths } },
    ).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = await CounselNote.findById(id).exec();
  } catch (e) {
    ctx.throw(500, e);
  }
};
