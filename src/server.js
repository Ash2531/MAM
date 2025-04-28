const jsonServer = require('json-server')
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const routes = require("../routes.json") // Make sure this path is correct
const rewriter = jsonServer.rewriter(routes);
server.use(middlewares);
server.use(rewriter);
server.use(router);
const PORT = 3000;
server.listen(PORT, () => {
 console.log(`JSON Server is running on port ${PORT}`);
});
