const {
  adminBestProfessionDocs,
  adminBestClientsDocs,
} = require("./src/docs/adminDocs");
const {
  contractByContractIdDocs,
  getContractsDocs,
} = require("./src/docs/contractDocs");
const { depositBalanceToUserIdDocs } = require("./src/docs/balanceDocs");
const { getUnpaidJobsDocs, payJobByIdDocs } = require("./src/docs/jobDocs");

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Deel API Test by Alonso Salas",
    version: "1.0.0",
    description:
      "The API provides a comprehensive set of endpoints to facilitate the management of contracts, jobs, and financial transactions within the Deel platform.",
  },
  paths: {
    "/admin/best-clients": adminBestClientsDocs,
    "/admin/best-profession": adminBestProfessionDocs,
    "/balances/deposit/{userId}": depositBalanceToUserIdDocs,
    "/contracts/{contractId}": contractByContractIdDocs,
    "/contracts": getContractsDocs,
    "/jobs/unpaid": getUnpaidJobsDocs,
    "/jobs/{jobId}/pay": payJobByIdDocs,
  },
  components: {
    securitySchemes: {
      profile_id: {
        type: "apiKey",
        in: "header",
        name: "profile_id",
      },
    },
  },
};
