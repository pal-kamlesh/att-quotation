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
export { differenceBetweenArrays, removeIdFromDocuments, remove_IdFromObj };
