const proxy = require('http-proxy-middleware');

// 로컬 환경에서 cors 이슈 해결을 위한 프록시 설정, 3000번 포트
module.export = function (app) {
  app.use(
    proxy('/api/', {
      target: 'http://localhost:3000/'
    })
  );
};
