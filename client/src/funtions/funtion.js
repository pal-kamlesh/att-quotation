function saprateQuoteInfo(a1) {
  const array = [...a1];
  const stan = array.filter((a1) => a1.applyRate === null);
  const ApSp = array.filter((a1) => a1.applyRate !== null);
  return [stan, ApSp];
}

export { saprateQuoteInfo };
