import { Counter, QuoteArchive } from "../models/index.js";
import ExcelJS from "exceljs";
import brevo from "@getbrevo/brevo";
import { createExcelBuilder as excelBuilder } from "../utils/functions.js";

function differenceBetweenArrays(A, B) {
  return A.filter((element) => !B.includes(element));
}

const removeIdFromDocuments = (documents) => {
  return documents.map(({ id, ...rest }) => rest);
};
const remove_IdFromObj = (obj) => {
  const { _id, ...rest } = obj;
  return rest;
};

async function createQuoteArchiveEntry(
  quoteId,
  state,
  author,
  message,
  changes
) {
  const theArchive = await QuoteArchive.findOne({ quotationId: quoteId });
  if (theArchive) {
    theArchive.revisions.push({ state, author, message, changes });
    await theArchive.save();
  } else {
    const newArchive = new QuoteArchive({
      quotationId: quoteId,
      revisions: [{ state, author, message, changes }],
    });
    await newArchive.save();
  }
}

async function createContractArchiveEntry(
  contractId,
  state,
  author,
  message,
  changes
) {
  const theArchive = await QuoteArchive.findOne({ contractId });
  if (theArchive) {
    theArchive.revisions.push({ state, author, message, changes });
    await theArchive.save();
  } else {
    const newArchive = new QuoteArchive({
      contractId,
      revisions: [{ state, author, message, changes }],
    });
    await newArchive.save();
  }
}

function isRevised(string) {
  const parts = String(string).split("/");

  const lastPart = parts[parts.length - 1];

  const regex = /R([1-9][0-9]*)/;

  return regex.test(lastPart);
}

function createExcelBuilder() {
  // Initialize workbook in closure scope
  const workbook = new ExcelJS.Workbook();
  const worksheetQuote = workbook.addWorksheet("Quotes");
  const worksheetContract = workbook.addWorksheet("Contracts");
  const worksheetMonthelyQuote = workbook.addWorksheet("Monthely Quote");

  // Set up headers
  worksheetQuote.columns = [
    { header: "REP", key: "salesPerson", width: 15 },
    { header: "Date", key: "quotationDate", width: 15 },
    { header: "Quote No", key: "quotationNo", width: 15 },
    { header: "Name of Client", key: "clientName", width: 30 },
    { header: "Area", key: "area", width: 15 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Contact Nos", key: "contactNos", width: 15 },
    { header: "Remark", key: "remark", width: 30 },
  ];

  worksheetContract.columns = [
    { header: "REP", key: "salesPerson", width: 15 },
    { header: "Date", key: "quotationDate", width: 15 },
    { header: "Contract No", key: "quotationNo", width: 15 },
    { header: "Name of Client", key: "clientName", width: 30 },
    { header: "Area", key: "area", width: 15 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Contact Nos", key: "contactNos", width: 15 },
    { header: "Remark", key: "remark", width: 30 },
  ];

  worksheetMonthelyQuote.columns = [
    { header: "REP", key: "salesPerson", width: 15 },
    { header: "Date", key: "quotationDate", width: 15 },
    { header: "Quote No", key: "quotationNo", width: 15 },
    { header: "Name of Client", key: "clientName", width: 30 },
    { header: "Area", key: "area", width: 15 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Contact Nos", key: "contactNos", width: 15 },
    { header: "Remark", key: "remark", width: 30 },
  ];

  // Inner function that processes data and maintains chainability
  async function addData(data) {
    if (data && data.length === 0) {
      return addData;
    }
    if (!data) {
      // If called without data, return the workbook buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    }
    // Process the data
    data.forEach((quotation) => {
      const clientName = quotation.billToAddress.name;
      const area =
        quotation.quoteInfo.map((quote) => quote.workArea).join("& ") || "";
      const amount =
        quotation.quoteInfo
          .map(
            (quote) =>
              `${quote.serviceRate} ${quote.serviceRateUnit}- ${quote.chemical}`
          )
          .join("& ") || "";
      const contactNosBillTo =
        quotation.billToAddress.kci
          .map((kci) => `${kci.contact} (${kci.name})`)
          .join(", ") || "";
      const contactNosShipTo =
        quotation.shipToAddress.kci
          .map((kci) => `${kci.contact} (${kci.name})`)
          .join(", ") || "";
      const contactNos =
        [contactNosBillTo, contactNosShipTo].filter(Boolean).join("& ") || "";

      // Choose worksheet based on quotation type
      const worksheet =
        quotation.type === "contract"
          ? worksheetContract
          : quotation.type === "monthlyQuote"
          ? worksheetMonthelyQuote
          : worksheetQuote;

      worksheet.addRow({
        salesPerson: quotation.salesPerson.initials,
        quotationDate: quotation.quotationDate,
        quotationNo: quotation.quotationNo || quotation._id,
        clientName: clientName,
        area: area,
        amount: amount,
        contactNos: contactNos,
        remark: quotation.note || "",
      });
    });

    // Return the function itself for chaining
    return addData;
  }

  return addData;
}

async function generateAndSendReport(data) {
  const { weeklyDataContract, weeklyDataQuote, monthelyDataQuote, subdata } =
    data;
  try {
    let weeklyDataContractNew = weeklyDataContract.map((data) => ({
      ...data,
      type: "contract",
    }));
    let monthelyDataQuoteNew = monthelyDataQuote.map((data) => ({
      ...data,
      type: "monthlyQuote",
    }));
    const builder = excelBuilder();
    const r1 = await builder(weeklyDataQuote); // Add weekly quote data
    const r2 = await r1(weeklyDataContractNew); // Add weekly contract data
    const rf = await r2(monthelyDataQuoteNew); //Add monthely data
    const excelBuffer = await rf(); // Complete and get the buffer

    //const excelBuffer = await generateExcel(data);
    const base64File = excelBuffer.toString("base64");

    // Set up Brevo client
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_KEY;
    let apiInstance = new brevo.TransactionalEmailsApi();

    let sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "EPCORN",
      email: process.env.EA_EMAIL,
    };

    sendSmtpEmail.to = [
      { email: process.env.NO_REPLY_EMAIL },
      //{ email: process.env.OFFICE_EMAIL },
    ];
    sendSmtpEmail.params = subdata;

    sendSmtpEmail.templateId = 9;

    // Attach the file directly using base64
    sendSmtpEmail.attachment = [
      {
        content: base64File,
        name: "Report.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return base64File;
  } catch (error) {
    console.error("Error in generate and send report:", error);
    throw new Error("Failed to generate and send report");
  }
}
async function manageDcCounter() {
  let dcCounter = await Counter.findById("dcCounter");
  if (!dcCounter) {
    dcCounter = await new Counter({ _id: "dcCounter", seq: 0 }).save();
  }
  // Increment the counter and get the new sequence number
  dcCounter = await Counter.findByIdAndUpdate(
    "dcCounter",
    { $inc: { seq: 1 } },
    { new: true }
  );
  return dcCounter.seq;
}
async function manageWarrantyCounter() {
  let warrantyCounter = await Counter.findById("warrantyCounter");
  if (!warrantyCounter) {
    warrantyCounter = await new Counter({
      _id: "warrantyCounter",
      seq: 0,
    }).save();
  }
  // Increment the counter and get the new sequence number
  warrantyCounter = await Counter.findByIdAndUpdate(
    "warrantyCounter",
    { $inc: { seq: 1 } },
    { new: true }
  );
  return warrantyCounter.seq;
}

export {
  generateAndSendReport,
  manageDcCounter,
  manageWarrantyCounter,
  differenceBetweenArrays,
  removeIdFromDocuments,
  remove_IdFromObj,
  createQuoteArchiveEntry,
  isRevised,
  createContractArchiveEntry,
  createExcelBuilder,
};
