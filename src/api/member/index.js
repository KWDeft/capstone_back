import Router from 'koa-router';
import * as adminCtrl from './admin.ctrl';
import * as coachCtrl from './coach.ctrl';

const member = new Router();

// 관리자
member.get('/admin', adminCtrl.list);
member.post('/admin/create', adminCtrl.adminCreate);
member.get('/admin/:id', adminCtrl.read);
member.delete('/admin/:id', adminCtrl.remove);
member.patch('/admin/:id', adminCtrl.update);

member.post('/admin/search', adminCtrl.search); // 관리자 검색

// 코치
member.get('/coach', coachCtrl.list);
member.get('/coach/coachname', coachCtrl.namelist);
member.post('/coach/create', coachCtrl.coachCreate);
member.get('/coach/:id', coachCtrl.read);
member.delete('/coach/:id', coachCtrl.remove);
member.patch('/coach/:id', coachCtrl.update);
member.get('/coach/responsible/:manager', coachCtrl.responsible); // 담당회원 조회
member.post('/coach/search', coachCtrl.search); // 코치 검색
member.get('/coach/coachnum/:coachnum', coachCtrl.searchcoachnum); // 코치 검색
member.post('/coach/confirm', coachCtrl.phoneConfirm); // 코치 전화번호 중복 확인


// 구성원 (관리자, 코치 통합)
member.post('/search', coachCtrl.searchMember); // 관리자 검색 -> 코드는 coach.ctrl.js에 있음

export default member;
