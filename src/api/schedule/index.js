import Router from 'koa-router';
import * as scheduleAdminCtrl from './admin.ctrl';
import * as scheduleCoachCtrl from './coach.ctrl';
import * as scheduleConsumerCtrl from './consumer.ctrl';


const schedule = new Router();

schedule.post('/admin', scheduleAdminCtrl.scheduleAdmin);
schedule.get('/admin/list', scheduleAdminCtrl.list);
schedule.get('/admin/usernum/:usernum', scheduleAdminCtrl.searchNum);
schedule.get('/admin/username/:name', scheduleAdminCtrl.searchName);
schedule.get('/admin/manager/:manager', scheduleAdminCtrl.managerschedule);
schedule.patch('/admin/:id', scheduleAdminCtrl.update);
schedule.delete('/admin/:id', scheduleAdminCtrl.remove);
schedule.get('/admin/id/:id', scheduleAdminCtrl.read);


schedule.post('/coach', scheduleCoachCtrl.scheduleCoach);
schedule.get('/coach/list/:manager', scheduleCoachCtrl.list);
schedule.get('/coach/usernum/:usernum', scheduleCoachCtrl.searchNum);
schedule.get('/coach/username/:name', scheduleCoachCtrl.searchName);
schedule.get('/coach/coachnum/:coachnum', scheduleCoachCtrl.listwithcoachnum);
schedule.patch('/coach/:id', scheduleCoachCtrl.update);
schedule.delete('/coach/:id', scheduleCoachCtrl.remove);


schedule.get('/consumer/:usernum', scheduleConsumerCtrl.list);
export default schedule;