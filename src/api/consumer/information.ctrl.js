import Joi from 'joi';
import Info from '../../models/consumer.info';

/*
    GET /api/consumer/info
*/
export const list = async (ctx) => {
  try {
    const posts = await Info.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/consumer/info/create
  {
    usernum: 123, 
    userheight: 160, 
    userwidth: 50, 
    sex: "여자", 
    existence: "유", 
    name: "김광운", 
    obstacle_type: "장애유형", 
    phone: "01012341234", 
    address: "서울특별시 노원구", 
    memo: "기타메모",
    manager: "김코치", 
    payment: "계좌이체", 
    inflow: "유입경로",
    statement: "상태", 
    date_signup: "2001-01-01", 
    birthday: "2001-01-01",
    membership: "회원권1",
    user_purpose: "운동 목적",
    vaccinate: "백신유무",
    category: "오프라인",
    profile: ""
  }
*/
export const inforCreate = async (ctx) => {
  // Request Body 검증하기
  // 필수: 회원번호, 성별, 장애 유무, 이름, 전화번호, 담당자
  // 선택: 키, 몸무게, 장애 유형, 주소, 기타메모, 결제정보, 유입경로, 상태, 가입일시, 생년월일, 회원권, 운동목적
  const schema = Joi.object().keys({
    usernum: Joi.number().required(), // 회원 번호
    userheight: Joi.number(), // 키
    userwidth: Joi.number(), // 몸무게
    sex: Joi.string().required(), // 성별
    existence: Joi.string().required(), // 장애 유무
    name: Joi.string().required(), // 이름(필수)
    obstacle_type: Joi.string(), // 장애 유형
    phone: Joi.string().required(), // 전화번호(필수)
    address: Joi.string(), // 주소
    memo: Joi.string(), // 기타 메모
    manager: Joi.string().required(), // 담당자(필수) -> 코치번호로 작성하기
    payment: Joi.string(), // 결제정보
    inflow: Joi.string(), // 유입경로
    statement: Joi.string(), // 상태
    date_signup: Joi.string(), // 가입일시
    birthday: Joi.string(), // 생년월일
    membership: Joi.string(), // 회원권
    user_purpose: Joi.string(), // 운동목적
    vaccinate: Joi.string(), // 백신유무
    category: Joi.string(), // 유형
    profile: Joi.string(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    usernum,
    userheight,
    userwidth,
    sex,
    existence,
    name,
    obstacle_type,
    phone,
    address,
    memo,
    manager,
    payment,
    inflow,
    statement,
    date_signup,
    birthday,
    membership,
    user_purpose,
    vaccinate,
    category,
    profile,
  } = ctx.request.body;
  try {
    // usernum 이 이미 존재하는지 확인
    const exists = await Info.findByUsernum(usernum);
    if (exists) {
      ctx.status = 409; // Conflict
      return;
    }

    const post = new Info({
      usernum: usernum,
      userheight: userheight,
      userwidth: userwidth,
      sex: sex,
      existence: existence,
      name: name,
      obstacle_type: obstacle_type,
      phone: phone,
      address: address,
      memo: memo,
      manager: manager,
      payment: payment,
      inflow: inflow,
      statement: statement,
      date_signup: date_signup,
      birthday: birthday,
      membership: membership,
      user_purpose: user_purpose,
      vaccinate: vaccinate,
      category: category,
      profile: profile,
    });

    await post.save(); // 데이터베이스에 저장

    ctx.body = ctx.request.body;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    GET /api/consumer/info/:id
*/
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Info.findById(id).exec();
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
    GET /api/consumer/info/usernum/:usernum
*/
export const searchusernum = async (ctx) => {
  const { usernum } = ctx.params;
  try {
    const post = await Info.findOne({ usernum: usernum }).exec();
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
    DELETE /api/consumer/info/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Info.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
    PATCH /api/consumer/info/:id
    {
        title: '수정',
        body: '수정 내용',
        tags: ['수정', '태그']
    }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Info.findByIdAndUpdate(id, ctx.request.body, {
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
    Post /api/consumer/info/search
    {
      name: "김회원"
    }
*/
export const userSearch = async (ctx) => {
  const { name } = ctx.request.body;

  try {
    const post = await Info.find({ name: { $regex: name } }).exec();
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
    POST /api/consumer/profile/upload
    {
      file: 
    }
*/
export const UploadProfile = async (ctx) => {
  const {
    fieldname,
    originalname,
    encoding,
    mimetype,
    destination,
    filename,
    path,
    size,
  } = ctx.request.file;
  const { name } = ctx.request.body;

  console.log('body 데이터 : ', name);
  console.log('폼에 정의된 필드명 : ', fieldname);
  console.log('사용자가 업로드한 파일 명 : ', originalname);
  console.log('파일의 엔코딩 타입 : ', encoding);
  console.log('파일의 Mime 타입 : ', mimetype);
  console.log('파일이 저장된 폴더 : ', destination);
  console.log('destinatin에 저장된 파일 명 : ', filename);
  console.log('업로드된 파일의 전체 경로 ', path);
  console.log('파일의 바이트(byte 사이즈)', size);

  ctx.body = { ok: true, data: 'Profile Upload Ok', path: path };
};
