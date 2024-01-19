const { Op } = require("sequelize");
const {
  generateDateRangeWhereClause,
} = require("../../../src/utils/helpers/queryHelper");

describe("generateDateRangeWhereClause", () => {
  it("should generate where clause with between condition if both start and end are provided", () => {
    const start = "2022-01-01";
    const end = "2022-12-31";

    const result = generateDateRangeWhereClause(start, end);

    expect(result).toEqual({
      paymentDate: {
        [Op.between]: [start, end],
      },
    });
  });

  it("should generate where clause with greater than or equal condition if only start is provided", () => {
    const start = "2022-01-01";

    const result = generateDateRangeWhereClause(start, null);

    expect(result).toEqual({
      paymentDate: {
        [Op.gte]: start,
      },
    });
  });

  it("should generate where clause with less than or equal condition if only end is provided", () => {
    const end = "2022-12-31";

    const result = generateDateRangeWhereClause(null, end);

    expect(result).toEqual({
      paymentDate: {
        [Op.lte]: end,
      },
    });
  });

  it("should return an empty object if neither start nor end is provided", () => {
    const result = generateDateRangeWhereClause(null, null);

    expect(result).toEqual({});
  });
});
