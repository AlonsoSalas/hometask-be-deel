module.exports = {
  getUnpaidJobsDocs: {
    get: {
      tags: ["jobs"],
      summary:
        "Get all unpaid jobs for the calling user (either client or contractor) in active contracts.",
      security: [
        {
          profile_id: [],
        },
      ],
      responses: {
        200: {
          description: "Successful response with the list of unpaid jobs.",
          content: {
            "application/json": {
              example: [
                {
                  id: 1,
                  description: "Job Description 1",
                  price: 100,
                },
                {
                  id: 2,
                  description: "Job Description 2",
                  price: 150,
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
  payJobByIdDocs: {
    post: {
      tags: ["jobs"],
      summary:
        "Pay for a job, transferring the amount from the client's balance to the contractor's balance.",
      parameters: [
        {
          in: "path",
          name: "jobId",
          description: "The ID of the job to pay for.",
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
          description:
            "Successful response with a message indicating the payment was successful.",
          content: {
            "application/json": {
              example: {
                message: "Payment successful.",
              },
            },
          },
        },
        401: {
          description: "Unauthorized. User not authenticated.",
        },
        404: {
          description:
            "Not Found. Job with the given ID not found or already paid.",
        },
        500: {
          description: "Internal Server Error.",
        },
      },
    },
  },
};
