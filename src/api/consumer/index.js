import Router from 'koa-router';
import * as inforCtrl from './information.ctrl';
import * as classnoteCtrl from './classnote.ctrl';
import * as counselnoteCtrl from './counselnote.ctrl';
import * as paymentCtrl from './payment.ctrl';

const consumer = new Router();

// 회원 정보
consumer.get('/info', inforCtrl.list);
consumer.post('/info/create', inforCtrl.inforCreate);
consumer.get('/info/:id', inforCtrl.read);
consumer.get('/info/usernum/:usernum', inforCtrl.searchusernum);
consumer.get('/info/usernumlist/:usernum', inforCtrl.usernamelist);

consumer.delete('/info/:id', inforCtrl.remove);
consumer.patch('/info/:id', inforCtrl.update);

consumer.post('/info/search', inforCtrl.userSearch); // 회원 검색

// 노트 - 수업일지 등록
consumer.get('/note/class', classnoteCtrl.list);
consumer.post('/note/class/create', classnoteCtrl.Create);
consumer.get('/note/class/:id', classnoteCtrl.read);
consumer.delete('/note/class/:id', classnoteCtrl.remove);
consumer.patch('/note/class/:id', classnoteCtrl.update);

consumer.get('/note/class/user/:usernum', classnoteCtrl.userClass);

// 노트 - 상담일지 등록
consumer.get('/note/counsel', counselnoteCtrl.list);
consumer.post('/note/counsel/create', counselnoteCtrl.Create);
consumer.get('/note/counsel/:id', counselnoteCtrl.read);
consumer.delete('/note/counsel/:id', counselnoteCtrl.remove);
consumer.patch('/note/counsel/:id', counselnoteCtrl.update);

consumer.get('/note/counsel/user/:usernum', counselnoteCtrl.userCounsel);

// 결제 정보
consumer.get('/payment', paymentCtrl.list);
consumer.post('/payment/create', paymentCtrl.Create);
consumer.get('/payment/:id', paymentCtrl.read);
consumer.delete('/payment/:id', paymentCtrl.remove);
consumer.patch('/payment/:id', paymentCtrl.update);

consumer.get('/payment/user/:usernum', paymentCtrl.userPayment);

// 프로필 이미지
const multer = require('@koa/multer');

const limits = {
  fieldNameSize: 1000, // 필드명 사이즈 최대값 (기본값 100bytes)
  filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
  fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
  fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
  files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
};

const fileFilter_profile = (req, file, callback) => {
  const typeArray = file.mimetype.split('/');

  const fileType = typeArray[1]; // 이미지 확장자 추출

  //이미지 확장자 구분 검사
  if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png') {
    callback(null, true);
  } else {
    return callback(
      { message: '*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다.' },
      false,
    );
  }
};

const upload_profile = multer({
  dest: __dirname + '/uploads_profile/', // 이미지 업로드 경로
  limits: limits, // 이미지 업로드 제한 설정
  fileFilter: fileFilter_profile, // 이미지 업로드 필터링 설정
});

consumer.patch(
  '/profile/upload/:id',
  upload_profile.single('file'),
  inforCtrl.UploadProfile,
);

// 수업일지 첨부파일
const limits_classfile = {
  fieldNameSize: 1000, // 필드명 사이즈 최대값 (기본값 100bytes)
  filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
  fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
  fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
  files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
};

const fileFilter_class = (req, file, callback) => {
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

const upload_class = multer({
  dest: __dirname + '/uploads_class/', // 이미지 업로드 경로
  limits: limits_classfile, // 이미지 업로드 제한 설정
  fileFilter: fileFilter_class, // 이미지 업로드 필터링 설정
});

consumer.patch(
  '/note/class/upload/:id',
  upload_class.array('file'),
  classnoteCtrl.UploadClassfile,
);

// 상담일지 첨부파일
const limits_counselfile = {
  fieldNameSize: 1000, // 필드명 사이즈 최대값 (기본값 100bytes)
  filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
  fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
  fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
  files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
};

const fileFilter_counsel = (req, file, callback) => {
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

const upload_counsel = multer({
  dest: __dirname + '/uploads_counsel/', // 이미지 업로드 경로
  limits: limits_counselfile, // 이미지 업로드 제한 설정
  fileFilter: fileFilter_counsel, // 이미지 업로드 필터링 설정
});

consumer.patch(
  '/note/counsel/upload/:id',
  upload_counsel.array('file'),
  counselnoteCtrl.UploadCounselfile,
);

export default consumer;
