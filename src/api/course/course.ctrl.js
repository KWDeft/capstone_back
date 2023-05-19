import Course from '../../models/course';
import Joi from 'joi';

/*
    POST /api/course/write
    {
        title: "제목",
        detail: "장애",
        content: "내용",
        effect: "효과",
        attachment: ["url1", "url2"]
    }
*/
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    detail: Joi.string().required(),
    content: Joi.string().required(),
    effect: Joi.string().required(),
    attachment: Joi.array().items(Joi.string()),
  });

  //검증과 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; //Bad request
    ctx.body = result.error;
    return;
  }

  const { title, detail, content, effect, attachment } = ctx.request.body;
  const course = new Course({
    title,
    detail,
    content,
    effect,
    attachment,
  });
  try {
    await course.save();
    ctx.body = course;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET /api/course/list
*/
export const list = async (ctx) => {
  try {
    const courses = await Course.find().exec();
    ctx.body = courses;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET /api/course/:id
*/
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const course = await Course.findById(id).exec();
    if (!course) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = course;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    DELETE /api/course/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Course.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공했으나 응답할 데이터 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    PUT /api/course/:id
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const course = await Course.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 업데이트된 데이터 반환
    }).exec();
    if (!course) {
      ctx.status = 404;
      return;
    }
    ctx.body = course;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    PATCH /api/course/file/upload/:id
    {
      file: ,
      file: 
    }
*/
export const UploadCoursefile = async (ctx) => {
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
    data: 'Course File Upload Ok',
    path: paths,
  };

  console.log(paths);

  const { id } = ctx.params;
  try {
    const post = await Course.updateOne(
      { _id: id },
      { $set: { attachment: paths } },
    ).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = await Course.findById(id).exec();
  } catch (e) {
    ctx.throw(500, e);
  }
};
