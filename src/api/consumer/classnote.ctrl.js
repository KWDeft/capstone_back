import Joi from 'joi';
// import Info from '../../models/consumer.info';
import ClassNote from '../../models/consumer.note.class';

/*
    GET /api/consumer/note/class
*/
export const list = async (ctx) => {
  try {
    const posts = await ClassNote.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/consumer/note/class/create
  {
    times: 3, 
    remains: 2, 
    usernum: 123, 
    classname: "바른 자세", 
    subject: "수업 제목",
    purpose: "자세 교정", 
    manager: "이코치", 
    contents: "자세 교정을 위해 바른 자세 수업을 진행했다.", 
    comments: "수업에 맞게 잘 따라와주심",
    date_class: "2023-01-18",
    ndate_class: "2023-01-19",
    attachment_class: "첨부파일"
  }
*/
export const Create = async (ctx) => {
  // Request Body 검증하기
  // 필수: 회차, 남은 수업 횟수, 회원 번호, 수업 이름, 담당자, 수업 내용, 수업 제목, 날짜, 다음 수업 날짜 / 선택: 목적, 코멘트, 첨부파일
  const schema = Joi.object().keys({
    times: Joi.number().required(), // 회차
    remains: Joi.number().required(), // 남은 수업 횟수
    usernum: Joi.number().required(), // 회원 번호
    classname: Joi.string().required(), // 수업 이름
    purpose: Joi.string(), // 목적
    manager: Joi.string().required(), // 담당자
    contents: Joi.string().required(), // 수업 내용
    comments: Joi.string(), // 코멘트
    date_class: Joi.string(), // 날짜
    subject: Joi.string(), // 수업 제목
    ndate_class: Joi.string(), // 다음 수업 날짜
    attachment_class: Joi.array().items(Joi.string()), // 첨부파일
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    times,
    remains,
    usernum,
    classname,
    purpose,
    manager,
    contents,
    comments,
    date_class,
    ndate_class,
    subject,
    attachment_class,
  } = ctx.request.body;
  try {
    const post = new ClassNote({
      times: times,
      remains: remains,
      usernum: usernum,
      classname: classname,
      purpose: purpose,
      manager: manager,
      contents: contents,
      comments: comments,
      date_class: date_class,
      ndate_class: ndate_class,
      subject: subject,
      attachment_class: attachment_class,
    });

    await post.save(); // 데이터베이스에 저장

    ctx.body = ctx.request.body;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET /api/consumer/note/class/:id
*/
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await ClassNote.findById(id).exec();
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
    DELETE /api/consumer/note/class/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await ClassNote.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    PATCH /api/consumer/note/class/:id
    {
        title: '수정',
        body: '수정 내용',
        tags: ['수정', '태그']
    }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await ClassNote.findByIdAndUpdate(id, ctx.request.body, {
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
    Get  /api/consumer/note/class/user/:usernum
    (예. /api/consumer/note/class/user/123)
*/
export const userClass = async (ctx) => {
  const { usernum } = ctx.params;

  try {
    const post = await ClassNote.find({ usernum: usernum }).exec();
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
    PATCH /api/consumer/note/class/upload/:id
    {
      file: ,
      file: 
    }
*/
export const UploadClassfile = async (ctx) => {
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
    data: 'Classnote File Upload Ok',
    path: paths,
  };

  console.log(paths);

  const { id } = ctx.params;
  try {
    const post = await ClassNote.updateOne(
      { _id: id },
      { $set: { attachment_class: paths } },
    ).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = await ClassNote.findById(id).exec();
  } catch (e) {
    ctx.throw(500, e);
  }
};
