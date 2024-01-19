module.exports = {
  contractByContractIdDocs: {
    get: {
      tags: ["contracts"],
      summary: "Get details of a contract by ID.",
      parameters: [
        {
          in: "path",
          name: "contractId",
          description: "The ID of the contract to retrieve.",
          required: true,
          schema: {
            type: "integer",
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
          description: "Successful response with the contract details.",
          content: {
            "application/json": {
              example: {
                id: 1,
                title: "Contract Title",
                status: "Active",
              },
            },
          },
        },
        401: {
          description: "Unauthorized. User not authenticated.",
        },
        403: {
          description:
            "Forbidden. The contract does not belong to the calling profile.",
        },
        404: {
          description: "Not Found. Contract with the given ID not found.",
        },
        500: {
          description: "Internal Server Error.",
        },
      },
    },
  },
  getContractsDocs: {
    get: {
      tags: ["contracts"],
      summary:
        "Get a list of contracts belonging to the calling user (client or contractor).",
      security: [
        {
          profile_id: [],
        },
      ],
      responses: {
        200: {
          description: "Successful response with the list of contracts.",
          content: {
            "application/json": {
              example: [
                {
                  id: 1,
                  title: "Contract Title 1",
                  status: "Active",
                },
                {
                  id: 2,
                  title: "Contract Title 2",
                  status: "Active",
                },
              ],
            },
          },
        },
        401: {
          description: "Unauthorized. User not authenticated.",
        },
        500: {
          description: "Internal Server Error.",
        },
      },
    },
  },
};
