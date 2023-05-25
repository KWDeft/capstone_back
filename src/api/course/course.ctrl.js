import Course from '../../models/course';
import Joi from 'joi';

const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({
  cloud_name: 'diuaakllc',
  api_key: '433417138596379',
  api_secret: 'jBXm92um5wxVuJ-oWhQ-OUykAKk',
});

/*
    POST /api/course/write
    {
        title: "제목",
        detail: "장애",
        content: "내용",
        effect: "효과",
        attachment: ["url1"],
        file_video: ["url"]
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
    file_video: Joi.array().items(Joi.string()),
  });

  //검증과 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; //Bad request
    ctx.body = result.error;
    return;
  }

  const { title, detail, content, effect, attachment, file_video } =
    ctx.request.body;
  const course = new Course({
    title,
    detail,
    content,
    effect,
    attachment,
    file_video,
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
      file: 
    }
*/
export const UploadCoursefile = async (ctx) => {
  const { name } = ctx.request.body;
  // console.log('body 데이터 : ', name);

  var paths = [];
  var img_url = [];

  //배열 형태이기 때문에 반복문을 통해 파일 정보를 알아낸다.
  ctx.request.files.map((data) => {
    // console.log('폼에 정의된 필드명 : ', data.fieldname);
    // console.log('사용자가 업로드한 파일 명 : ', data.originalname);
    // console.log('파일의 엔코딩 타입 : ', data.encoding);
    // console.log('파일의 Mime 타입 : ', data.mimetype);
    // console.log('파일이 저장된 폴더 : ', data.destination);
    // console.log('destinatin에 저장된 파일 명 : ', data.filename);
    // console.log('업로드된 파일의 전체 경로 ', data.path);
    // console.log('파일의 바이트(byte 사이즈)', data.size);

    paths.push(data.path);
  });

  ctx.body = {
    ok: true,
    data: 'Course File Upload Ok',
    path: paths,
  };

  // console.log(paths);

  for (let i = 0; i < paths.length; i++) {
    const res = cloudinary.uploader.upload(paths[i], { public_id: name });

    res.then(async (data) => {
      img_url.push(data.secure_url);

      console.log(data.secure_url);

      const { id } = ctx.params;

      // console.log(img_url);

      try {
        const post = await Course.updateOne(
          { _id: id },
          { $set: { attachment: img_url } },
        ).exec();
        if (!post) {
          ctx.status = 404;
          return;
        }
        ctx.body = await Course.findById(id).exec();
      } catch (e) {
        ctx.throw(500, e);
      }
    });
  }
};

/*
    GET /api/course/file/url/:id
*/
export const fileUrl = async (ctx) => {
  const { id } = ctx.params;

  try {
    const post = await Course.findById(id).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post.attachment;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    PATCH /api/course/video/upload/:id
    {
      file: 
    }
*/
export const UploadVideo = async (ctx) => {
  const { name } = ctx.request.body;

  var paths = [];
  var video_url = [];

  ctx.request.files.map((data) => {
    paths.push(data.path);
  });

  ctx.body = {
    ok: true,
    data: 'Course File Upload Ok',
    path: paths,
  };

  for (let i = 0; i < paths.length; i++) {
    const res = cloudinary.uploader.upload(paths[i], {
      resource_type: 'video',
    });

    res.then(async (data) => {
      video_url.push(data.secure_url);

      const { id } = ctx.params;

      try {
        const post = await Course.updateOne(
          { _id: id },
          { $set: { file_video: data.secure_url } },
        ).exec();
        if (!post) {
          ctx.status = 404;
          return;
        }
        ctx.body = await Course.findById(id).exec();

        console.log(data.secure_url);
      } catch (e) {
        ctx.throw(500, e);
      }
    });
  }
};

/*
    GET /api/course/video/url/:id
*/
export const videoUrl = async (ctx) => {
  const { id } = ctx.params;

  try {
    const post = await Course.findById(id).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post.file_video;
  } catch (e) {
    ctx.throw(500, e);
  }
};
