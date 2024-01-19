const asyncHandler = require("express-async-handler");
const HttpProxy = require("../../src/utils/httpProxy");

class MockController {
  async exampleMethod() {
    return "exampleMethod";
  }
  async anotherMethod() {
    return "anotherMethod";
  }
}

jest.mock("express-async-handler", () => jest.fn((handler) => handler));

describe("HttpProxy", () => {
  it("should create a proxy with asyncHandler for controller methods", async () => {
    const proxy = HttpProxy(MockController);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await proxy.exampleMethod(req, res);
    await proxy.anotherMethod(req, res);

    expect(asyncHandler).toHaveBeenCalledTimes(2);
  });
});
