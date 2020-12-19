let Instagram = require('./instagram');

const igLogin = process.argv[2];
const igPassword = process.argv[3];

Instagram = new Instagram();


Instagram.getCsrfToken().then((csrf) =>
{
  Instagram.csrfToken = csrf;
}).then(() =>
{
  return Instagram.auth(igLogin, igPassword).then(sessionId =>
  {
    Instagram.sessionId = sessionId
 
    console.log(Instagram.sessionId);
    console.log(Instagram.csrfToken);
  })
}).catch(console.error);
