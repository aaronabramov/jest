import Koa from 'koa';
import koaStatic from 'koa-static';
import {runCLI} from 'jest-cli';
import path from 'path';
import fs from 'fs';

const app = new Koa();

const html = fs.readFileSync(path.resolve(__dirname, './public/index.html'));

const project = path.resolve(__dirname, '../jest.config.js');

app.use(koaStatic(path.resolve(__dirname, 'public')));

app.use(async ctx => {
  if (ctx.request.url === '/') {
    ctx.body = html;
    // const result = {}; //await runCLI({}, [project]);
    // ctx.body = JSON.stringify(result, null, 2);
  }
});

app.listen(3000);
console.log('listening 3000');
