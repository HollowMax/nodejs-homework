const { users } = require('../models/users');
const { userLogin } = require('../controllers/users');
require('dotenv').config();

describe('Login controller test', () => {
  it('empty test', async () => {
    const tReq = { body: { email: 'qwe@gmail.com', password: '123', subscription: 'pro' } };
    const tRes = {};
    const tNext = jest.fn();

    const { KEY } = process.env;

    const _id = '5';

    const user = { ...tReq.body, _id };

    jest.spyOn(users, 'findOne').mockImplementationOnce(() => user);
    jest.spyOn(users, 'findByIdAndUpdate').mockImplementationOnce(() => user);

    await userLogin(tReq, tRes, tNext);
  });
});
