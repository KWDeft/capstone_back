import Router from 'koa-router';
import * as courseCtrl from './course.ctrl';
import * as courseCommentCtrl from './courseComment.ctrl';

const course = new Router();

course.get('/list', courseCtrl.list);
course.post('/write', courseCtrl.write);
course.get('/:id', courseCtrl.read);
course.delete('/:id', courseCtrl.remove);
course.put('/:id', courseCtrl.update);
course.post('/comment', courseCommentCtrl.comment);
course.get('/comment/:courseId', courseCommentCtrl.getComments);
course.get('/comment/user/:userId', courseCommentCtrl.getCommentsInSetting);
course.delete('/comment/:id', courseCommentCtrl.remove);

// 파일 업로드 관련
const multer = require('@koa/multer');

const limits = {
  fieldNameSize: 1000, // 필드명 사이즈 최대값 (기본값 100bytes)
  filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
  fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
  fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
  files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
};

const fileFilter_course = (req, file, callback) => {
  const typeArray = file.mimetype.split('/');

  const fileType = typeArray[1]; // 이미지 확장자 추출

  //이미지 확장자 구분 검사
  if (
    fileType == 'jpg' ||
    fileType == 'jpeg' ||
    fileType == 'png' ||
    fileType == 'pdf' ||
    fileType == 'mov' ||
    fileType == 'mp4'
  ) {
    callback(null, true);
  } else {
    return callback(
      {
        message:
          '*.jpg, *.jpeg, *.png, *.pdf, *.mov, *.mp4 파일만 업로드가 가능합니다.',
      },
      false,
    );
  }
};

const upload_course = multer({
  dest: __dirname + '/uploads_course/', // 이미지 업로드 경로
  limits: limits, // 이미지 업로드 제한 설정
  fileFilter: fileFilter_course, // 이미지 업로드 필터링 설정
});

course.patch(
  '/file/upload/:id',
  upload_course.array('file'),
  courseCtrl.UploadCoursefile,
);

export default course;
