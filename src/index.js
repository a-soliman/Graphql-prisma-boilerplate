import '@babel/polyfill/noConflict';
import server from './server';

const port = process.env.PORT || 4000;

server.start({ port }, () => {
  console.log(`Server is running pn port ${port}`);
})