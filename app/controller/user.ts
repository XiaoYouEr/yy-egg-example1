import { Controller } from 'egg';

export default class UserController extends Controller {
  public async getUserInfo() {
    const { ctx } = this;
    const params = ctx.query;
    ctx.body = await ctx.service.user.getUserInfo(params);
  }

  public async addUserInfo() {
    const { ctx } = this;
    const params = ctx.request.body;
    ctx.body = await ctx.service.user.addUserInfo(params);
  }

  public async index() {
    const ctx = this.ctx;
    const query = { limit: toInt(ctx.query.limit), offset: toInt(ctx.query.offset) };
    ctx.body = await ctx.service.user.findAll(query);
  }

  public async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.User.findByPk(toInt(ctx.params.id));
  }

  public async create() {
    const ctx = this.ctx;
    const { name, age } = ctx.request.body;
    const user = await ctx.model.User.create({ name, age });
    ctx.status = 201;
    ctx.body = user;
  }

  public async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user:any = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    const { name, age } = ctx.request.body;
    await user.update({ name, age });
    ctx.body = user;
  }

  public async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user:any = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    await user.destroy();
    ctx.status = 200;
  }

  public async add() {
    const ctx = this.ctx;
    const params = ctx.request.body;
    const age = Number(params.age);
    const user:any = await ctx.service.user.addUser({ ...params, age });

    if (!user) {
      ctx.status = 404;
      return;
    }
    ctx.status = 200;
    ctx.body = user;
  }

  public async changePwd() {
    const ctx = this.ctx;
    const { id, oldPwd, newPwd } = ctx.request.body;
    const user:any = await ctx.service.user.updateUserPwd({ id: Number(id), oldPwd, newPwd });

    if (!user) {
      ctx.status = 404;
      return;
    }
    ctx.status = 200;
    ctx.body = user;
  }

  public async findAll() {
    const ctx = this.ctx;
    const { pageSize = 10, currentPage = 1, nameLike = '' } = ctx.query;
    const user:any = await ctx.service.user.findAllNew({ pageSize: Number(pageSize), currentPage: Number(currentPage), nameLike });
    if (!user) {
      ctx.status = 404;
      return;
    }
    ctx.status = 200;
    ctx.body = user;
  }

  public async getUser() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user:any = await ctx.service.user.getUser(id);
    if (!user) {
      ctx.status = 404;
      return;
    }
    ctx.status = 200;
    ctx.body = user;
  }
}

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}
