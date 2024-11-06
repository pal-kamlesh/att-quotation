import { QuoteArchive } from "../models/index.js";
import ExcelJS from "exceljs";

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
    console.log(typeof data);
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
        quotation.type === "contract" ? worksheetContract : worksheetQuote;

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

export {
  differenceBetweenArrays,
  removeIdFromDocuments,
  remove_IdFromObj,
  createQuoteArchiveEntry,
  isRevised,
  createContractArchiveEntry,
  createExcelBuilder,
};
