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

export { saprateQuoteInfo, getDotColor };
