import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.post('/user/add', controller.user.add);

  router.post('/user/changePwd', controller.user.changePwd);

  router.get('/user', controller.user.findAll);

  router.get('/user/:id', controller.user.getUser);

};

