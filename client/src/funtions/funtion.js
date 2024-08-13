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

export { saprateQuoteInfo, getDotColor, fetchImage, duplicateBillToShipTo };
