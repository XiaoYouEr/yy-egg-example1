import { Service } from 'egg';
import { Op } from 'sequelize';

/**
 * Test Service
 */
export default class UserService extends Service {

  public async getUserInfo(params: any): Promise<{ userName: string; age: number; }> {
    const userName = params.userName;
    const age = parseInt(params.age);
    this.logger.warn('this.config: ', this.config.pinganApi);
    return {
      userName,
      age: age + 1,
    };
  }

  public async addUserInfo(params: any): Promise<{ userName: string; age: number; }> {
    const result = await this.service.test.sayHi('Hi');
    return { ...params, result };
  }

  public async addUser(params: any): Promise<any> {
    const { name } = params;
    const ctx = this.ctx;
    const user:any = await ctx.model.User.findAll({
      where: {
        name,
      },
    });
    if (user.length > 0) {
      return {
        status: 401,
        success: false,
        data: [],
        message: '该姓名已存在，请更改姓名后重新提交',
      };
    }
    const now = new Date().toLocaleDateString();
    const newUser = await ctx.model.User.create({ ...params, created_at: now, updated_at: now });
    return {
      status: 200,
      success: true,
      data: newUser,
      message: '用户添加成功',
    };
  }

  public async updateUserPwd(params: {id: number; oldPwd: string; newPwd: string }): Promise<any> {
    const { id, oldPwd, newPwd } = params;
    if (oldPwd && oldPwd === newPwd) {
      return {
        status: 401,
        success: false,
        data: [],
        message: '新密码不能与旧密码不能相同',
      };
    }
    const ctx = this.ctx;
    const user:any = await ctx.model.User.findAll({
      where: {
        id,
        password: oldPwd,
      },
    });
    if (oldPwd && user.length === 0) {
      return {
        status: 401,
        success: false,
        data: [],
        message: '旧密码输入错误，请重新输入',
      };
    } else if (!oldPwd && user.length) {
      // @ts-ignore
      await ctx.model.User.update({ password: newPwd, updated_at: new Date().toLocaleDateString() }, { where: { id } });
      return {
        status: 200,
        success: false,
        data: [],
        message: '密码设置成功',
      };
    }

    // @ts-ignore
    await ctx.model.User.update({ password: newPwd, updated_at: new Date() }, {
      where: {
        id,
      },
    });
    return {
      status: 200,
      success: true,
      data: [],
      message: '密码修改成功',
    };
  }

  public async findAll(query: { limit: number, offset: number}) {
    const { limit, offset } = query;
    const data = await this.ctx.model.User.findAll({
      limit,
      offset,
    });
    return {
      status: 200,
      success: true,
      data,
      message: '数据获取成功',
    };
  }

  public async findAllNew(query: { pageSize: number, currentPage: number, nameLike: string}) {
    const { pageSize, currentPage, nameLike } = query;
    const whereOption = nameLike ? { name: {
      [Op.like]: `${nameLike}%`,
    } } : {};

    const data = await this.ctx.model.User.findAndCountAll({
      limit: pageSize,
      offset: pageSize * (currentPage - 1),
      where: { ...whereOption, [Op.or]: [{ name: {
        [Op.like]: '%x%',
      } }, { id: 10 }] },
      attributes: [ 'name', 'id' ],
    });
    return {
      status: 200,
      success: true,
      data: {
        data: data.rows,
        pageSize,
        currentPage,
        totle: data.count,
      },
      message: '数据获取成功',
    };
  }

  public async getUser(id: number) {
    const data = await this.ctx.model.User.findByPk(id);
    return {
      status: 200,
      success: true,
      data,
      message: '用户信息获取成功',
    };
  }
}
