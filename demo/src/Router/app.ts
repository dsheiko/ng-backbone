let router: Router;

class Router extends Backbone.Router {
  routes = {
    "*actions": "invokeDefault" // Backbone will try match the route above first
  };

  /**
  * placeholder
  */
 invokeDefault() {}

};

Backbone.utils.extend( Router.prototype, Backbone.Events );
router = new Router();
Backbone.history.start();

export default router;