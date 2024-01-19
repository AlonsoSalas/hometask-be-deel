module.exports = {
  adminBestClientsDocs: {
    get: {
      tags: ["admin"],
      summary:
        "Get the clients who paid the most for jobs in the specified time period.",
      security: [
        {
          profile_id: [],
        },
      ],
      parameters: [
        {
          in: "header",
          name: "profile_id",
          description: "The profile ID header.",
          schema: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "start",
          description: "Start date for filtering paid jobs.",
          schema: {
            type: "string",
            format: "date",
          },
        },
        {
          in: "query",
          name: "end",
          description: "End date for filtering paid jobs.",
          schema: {
            type: "string",
            format: "date",
          },
        },
        {
          in: "query",
          name: "limit",
          description: "Number of top clients to retrieve. Default is 2.",
          schema: {
            type: "integer",
          },
        },
      ],
      responses: {
        200: {
          description:
            "Successful response with the clients who paid the most.",
          content: {
            "application/json": {
              example: [
                {
                  id: 1,
                  fullName: "John Doe",
                  paid: 1000,
                },
                {
                  id: 2,
                  fullName: "Jane Smith",
                  paid: 800,
                },
              ],
            },
          },
        },
        401: {
          description: "Unauthorized. Profile ID header not provided.",
        },
      },
    },
  },
  adminBestProfessionDocs: {
    get: {
      tags: ["admin"],
      summary:
        "Get the profession that earned the most money for any contractor in the specified time range.",
      parameters: [
        {
          in: "header",
          name: "profile_id",
          description: "The profile ID header.",
          schema: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "start",
          description: "Start date for filtering paid jobs.",
          schema: {
            type: "string",
            format: "date",
          },
        },
        {
          in: "query",
          name: "end",
          description: "End date for filtering paid jobs.",
          schema: {
            type: "string",
            format: "date",
          },
        },
      ],
      security: [
        {
          profile_id: [],
        },
      ],
      responses: {
        200: {
          description:
            "Successful response with the profession that earned the most money.",
          content: {
            "application/json": {
              example: {
                profession: "Programmer",
                earned: 2883,
              },
            },
          },
        },
        401: {
          description: "Unauthorized. Profile ID header not provided.",
        },
      },
    },
  },
};
