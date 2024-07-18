/* eslint-disable react/prop-types */
const RevisionHistoryCard = ({ revision, onClick, active }) => {
  const { author, state, timestamp } = revision;
  const { quotationNo, shipToAddress, summary } = state;
  const formattedDate = new Date(timestamp).toLocaleDateString("en-GB");
  const formattedTime = new Date(timestamp).toLocaleTimeString();

  const cardStyles = active
    ? "w-sm bg-blue-100 shadow-lg rounded-lg overflow-hidden mb-4 border-2 border-blue-500"
    : "w-sm bg-white shadow-lg rounded-lg overflow-hidden mb-4";

  return (
    <div onClick={() => onClick(state)} className={cardStyles}>
      <div className="bg-gray-800 text-white text-center py-2">
        <h2 className="text-xl font-bold">Quotation No: {quotationNo}</h2>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="font-semibold">Author:</span> {author?.prefix}{" "}
          {author?.username} ({author?.initials})
        </div>
        <div className="mb-2">
          <span className="font-semibold">Date:</span> {formattedDate}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Time:</span> {formattedTime}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Project Name:</span>{" "}
          {shipToAddress?.projectName}
        </div>
        {summary && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Summary</h3>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevisionHistoryCard;
