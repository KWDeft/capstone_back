import Joi from 'joi';
import User from '../../models/user';
import Coach from '../../models/member.coach';
import bcrypt from 'bcrypt';

/*
  POST /api/auth/register
  {
    username: 'velopert',
    password: 'mypass123',
    role: 'admin',
  }
*/
export const register = async (ctx) => {
  // Request Body 검증하기
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
    role: Joi.string().required().valid('user', 'coach', 'admin'),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  

  const { username, password, role } = ctx.request.body;
  try {

    
    // username  이 이미 존재하는지 확인
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; // Conflict
      return;
    }

    console.log("result는",result.value.role);
    if (result.value.role == 'coach'){
    const checkCoach = await Coach.findOne({coachnum:username});
    console.log("있나?",checkCoach);
    if (checkCoach == undefined){
      console.log('존재하지 않는 코치');
      ctx.body ='존재하지 않는 코치입니다.'
      return;
      
      return;

    }
  }
    const user = new User({
      username,
      role,
    });
    await user.setPassword(password); // 비밀번호 설정
    await user.save(); // 데이터베이스에 저장

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/auth/login
  {
    username: 'velopert',
    password: 'mypass123'
  }
*/
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = await User.findOne({username : username}).exec();
  console.log(user.role); //로그인한 사용자의 역할(권한)

  // username, password 가 없으면 에러 처리
  if (!username || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    // 계정이 존재하지 않으면 에러 처리
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    // 잘못된 비밀번호
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true,
    });

    if (user.role == "admin"){
      console.log("관리자임");
    }

    // ctx.redirect("/fc/dashboard/")
    // res.send("<script>alert('안녕하세요!');</script>")
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/auth/check
*/
export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    // 로그인중 아님
    ctx.status = 401; // Unauthorized
    return;
  }
  ctx.body = user;
};

/*
  POST /api/auth/logout
*/
export const logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204; // No Content
};

/*
  POST /api/auth/updatePW
  {
    username: 'velopert',
    password_old: 'mypass123',
    password_new: 'mypass1234',
    password_check: 'mypass1234'
  }
*/
export const updatePW = async (ctx) => {
  // password_old: 현재 비밀번호, password_new: 새 비밀번호, password_check: 비밀번호 확인
  const { username, password_old, password_new, password_check } =
    ctx.request.body;

  // 입력값 중 하나라도 없으면 에러 처리
  if (!username || !password_old || !password_new || !password_check) {
    ctx.status = 401; // Unauthorized
    return;
  }

  // 새 비밀번호와 비밀번호 확인이 다를 경우 에러 처리
  if (password_new != password_check) {
    ctx.status = 401;
    return;
  }

  // 현재 비밀번호와 새 비밀번호가 동일할 경우 에러 처리
  if (password_old == password_new) {
    ctx.status = 401;
    return;
  }

  try {
    // username 이 존재하는지 확인
    const exists = await User.findByUsername(username);
    if (!exists) {
      ctx.body = 401;
      return;
    }

    // 현재 비밀번호 잘못 입력했을 때
    const valid = await exists.checkPassword(password_old);
    // 잘못된 비밀번호
    if (!valid) {
      ctx.status = 401;
      return;
    }

    // 비밀번호 변경 정상적으로 처리될 때
    await User.updateOne(
      { username: username }, // 입력한 username의 비밀번호(hashedPassword)를 새로 입력한 비밀번호의 hash 값으로 변경함
      { $set: { hashedPassword: await bcrypt.hash(password_new, 10) } },
    );

    ctx.body = ctx.request.body;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/auth/user/:username
*/
export const readuser = async (ctx) => {
  const {username} = ctx.params;

  console.log(username);
  try {
    const user = await User.find({username:username}).exec();
    if(!user) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = user;
  } catch (e) {
    ctx.throw(500, e);
  }
};
