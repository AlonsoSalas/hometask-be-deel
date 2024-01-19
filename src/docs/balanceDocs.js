module.exports = {
  depositBalanceToUserIdDocs: {
    post: {
      tags: ["balances"],
      summary:
        "Deposits money into the balance of a client. The client can't deposit more than 25% of their total jobs to pay at the deposit moment.",
      parameters: [
        {
          in: "path",
          name: "userId",
          description: "The ID of the client's profile.",
          required: true,
          schema: {
            type: "integer",
          },
        },
        {
          in: "body",
          name: "amount",
          description: "The amount to deposit.",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  amount: {
                    type: "number",
                  },
                },
              },
            },
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
          description: "Successful deposit.",
          content: {
            "application/json": {
              example: {
                message: "Deposit was successful.",
              },
            },
          },
        },
        400: {
          description: "Bad request. amount must be sent.",
        },
        401: {
          description: "Unauthorized. User not authenticated.",
        },
        403: {
          description: "Forbidden. Amount exceeds the maximum allowed deposit.",
        },
        404: {
          description: "Not Found. User profile with the given ID not found.",
        },
        500: {
          description: "Internal Server Error. Transaction failed.",
        },
      },
    },
  },
};
