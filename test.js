let Instagram = require('./instagram');

const igLogin = process.argv[2];
const igPassword = process.argv[3];

Instagram = new Instagram();

Instagram.sessionId = "10384331809%3AtWF7AgFdUX6SQd%3A14";
Instagram.csrfToken = "RcIV7ACtNtMYmvcuR4e5I1WH0ccLQX6f";

Instagram.getUserDataByUsername('suprahub').then(user => console.log(user));

// Instagram.getCsrfToken().then((csrf) =>
// {
//   Instagram.csrfToken = csrf;
// }).then(() =>
// {
//   return Instagram.auth(igLogin, igPassword).then(sessionId =>
//   {
//     Instagram.sessionId = sessionId
 
//     console.log(Instagram.sessionId);
//     console.log(Instagram.csrfToken);
//   })
// }).catch(console.error);
