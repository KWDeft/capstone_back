import CourseComment from '../../models/courseComment';
import Joi from 'joi';

/*
    POST /api/course/comment
    {
        content: '',
        userId: '',
        courseId: '',
        date: '',
    }
*/
export const comment = async (ctx) => {
  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검증
    content: Joi.string().required(), // required()가 있으면 필수 항목
    userId: Joi.string().required(),
    courseId: Joi.string().required(),
    date: Joi.string().required(),
  });

  //검증과 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; //Bad request
    ctx.body = result.error;
    return;
  }

  const { content, userId, courseId, date } = ctx.request.body;
  const courseComment = new CourseComment({
    content,
    userId,
    courseId,
    date,
    user: ctx.state.user,
  });
  try {
    await courseComment.save();
    ctx.body = courseComment;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    Get  /api/course/comment/:courseId
*/
export const getComments = async (ctx) => {
  const { courseId } = ctx.params;

  try {
    const post = await CourseComment.find({ courseId: courseId }).exec();
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
    DELETE /api/course/comment/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await CourseComment.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공했으나 응답할 데이터 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    Get  /api/course/comment/:courseId
*/
export const getCommentsInSetting = async (ctx) => {
  const { userId } = ctx.params;

  try {
    const post = await CourseComment.find({ userId: userId }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
