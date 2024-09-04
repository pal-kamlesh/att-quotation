import QRCode from "qrcode";

function saprateQuoteInfo(a1) {
  const array = [...a1];
  const stan = array.filter((a1) => a1.applyRate === null);
  const ApSp = array.filter((a1) => a1.applyRate !== null);
  return [stan, ApSp];
}

function getDotColor(docType) {
  switch (docType) {
    case "standard":
      return "bg-green-500";
    case "supply":
      return "bg-yellow-400";
    case "supply/apply":
      return "bg-blue-500";
    default:
      return "bg-red-500"; // Default background color if docType doesn't match the cases
  }
}

// Function to fetch image data as ArrayBuffer
const fetchImage = async (imagePath) => {
  const response = await fetch(imagePath);
  const blob = await response.blob();
  return await blob.arrayBuffer();
};

function duplicateBillToShipTo({ quote, setQuote }) {
  const { billToAddress } = quote;
  const { shipToAddress } = quote;

  // Create an object to hold the duplicated fields
  const updatedShipToAddress = {};

  // Loop through billToAddress keys and copy only those present in shipToAddress
  Object.keys(billToAddress).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(shipToAddress, key)) {
      updatedShipToAddress[key] = billToAddress[key];
    }
  });

  // Update the shipToAddress in the state
  setQuote({
    ...quote,
    shipToAddress: { ...shipToAddress, ...updatedShipToAddress },
  });
}

function getChemicalRatio(chemical) {
  if (chemical === "Chloropyriphos 20% EC") {
    return "1:475";
  } else {
    return "1:19";
  }
}

// Function to convert a base64 image to a Uint8Array
const base64ToUint8Array = (base64) => {
  const binaryString = atob(base64.split(",")[1]);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
async function qrCodeUint8Arrayfn(id) {
  try {
    // Generate QR Code as Base64
    const qrCodeUrl = await QRCode.toDataURL(
      `https://att-quotation.onrender.com/workLog/${id}`,
      { type: "image/png" } // Explicitly specify PNG format
    );
    return base64ToUint8Array(qrCodeUrl);
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}
async function base64Url(id) {
  try {
    // Generate QR Code as Base64
    const qrCodeUrl = await QRCode.toDataURL(
      `https://att-quotation.onrender.com/workLog/${id}`,
      { type: "image/png", width: 95, margin: 1 } // Explicitly specify PNG format
    );
    return qrCodeUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}

export {
  saprateQuoteInfo,
  getDotColor,
  fetchImage,
  duplicateBillToShipTo,
  getChemicalRatio,
  qrCodeUint8Arrayfn,
  base64Url,
};
