const asyncHandler = require("express-async-handler");

/**
 * Create a proxy over the Controller instance in order to automate the asyncHandler invocation
 * @param {Class} Controller The class used to handle a specific HTTP request group
 * @returns {Proxy} A proxy object wrapping the Controller class instance
 */
const HttpProxy = (Controller) => {
  const handler = new Controller();
  const interceptor = {
    get(target, prop) {
      const properties = Object.getOwnPropertyNames(Controller.prototype);
      if (properties.includes(prop) && prop !== "constructor") {
        return asyncHandler(target[prop]);
      }
      return target[prop];
    },
  };
  return new Proxy(handler, interceptor);
};

module.exports = HttpProxy;
