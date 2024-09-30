/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { archiveData } from "../redux/quote/quoteSlice.js";
import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { diff } from "deep-object-diff";
import { Loading, RevisionHistoryCard, ViewQuote } from "./index.js";

function HistoryPanelQuote({ quoteId }) {
  const dispatch = useDispatch();
  const [latest, setLatest] = useState({});
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resultAction = await dispatch(archiveData(quoteId));
        const result = unwrapResult(resultAction);

        const { archive: history, ...rest } = result.result;
        const obj = {
          state: rest,
          message: "",
          author: rest.createdBy,
          _id: rest._id,
          timestamp: rest.updatedAt,
        };
        setLatest(rest);
        setArchive(() => [obj, ...(history?.revisions ?? [])]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, quoteId]);

  useEffect(() => {
    if (archive?.length > 0) {
      const modifiedKeys = getModifiedKeys(archive[1].state, latest);
      console.log(modifiedKeys);
    }
  }, [latest, archive]);

  function getModifiedKeys(oldObj, newObj) {
    const difference = diff(oldObj, newObj);
    return Object.keys(difference);
  }

  const handleCardClick = (revision) => {
    setSelectedRevision(revision);
  };

  const revisionDetails = selectedRevision || latest;
  return (
    <div className="p-4 flex h-screen overflow-hidden">
      {/* Left Side: Revision History Cards */}
      <div className="w-1/4 pr-4 overflow-y-auto h-[calc(100vh-2rem)]">
        {/* Adjust height and add overflow-y-auto */}
        <h2 className="text-lg font-semibold sticky top-0 bg-white pb-2">
          Revision History:
        </h2>
        {/* Make the header sticky */}
        <div className="mt-2 flex flex-col gap-4">
          {archive?.map((revision, index) => (
            <RevisionHistoryCard
              key={index}
              revision={revision}
              onClick={handleCardClick}
              active={
                revision.state.quotationNo === revisionDetails?.quotationNo
              }
            />
          ))}
        </div>
      </div>

      {/* Right Side: Details */}

      <div className="w-3/4 overflow-y-auto h-[calc(100vh-2rem)]">
        {loading && <Loading />}
        {revisionDetails && <ViewQuote data={revisionDetails} />}
      </div>
    </div>
  );
}

export default HistoryPanelQuote;
