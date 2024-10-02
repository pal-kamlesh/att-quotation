import { diff } from "deep-object-diff";
import { QuoteArchive } from "../models/index.js";

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

async function createQuoteArchiveEntry(quoteId, state, author, message) {
  const theArchive = await QuoteArchive.findOne({ quotationId: quoteId });
  if (theArchive) {
    theArchive.revisions.push({ state, author, message });
    await theArchive.save();
  } else {
    const newArchive = new QuoteArchive({
      quotationId: quoteId,
      revisions: [{ state, author, message }],
    });
    await newArchive.save();
  }
}

async function createContractArchiveEntry(contractId, state, author, message) {
  const theArchive = await QuoteArchive.findOne({ contractId });
  if (theArchive) {
    theArchive.revisions.push({ state, author, message });
    await theArchive.save();
  } else {
    const newArchive = new QuoteArchive({
      contractId,
      revisions: [{ state, author, message }],
    });
    await newArchive.save();
  }
}

function getModifiedKeys(oldObj, newObj) {
  const difference = diff(oldObj, newObj);
  return Object.keys(difference);
}

export {
  differenceBetweenArrays,
  removeIdFromDocuments,
  remove_IdFromObj,
  createQuoteArchiveEntry,
  createContractArchiveEntry,
  getModifiedKeys,
};
