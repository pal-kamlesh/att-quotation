import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getSingleContract } from "../redux/contract/contractSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Refresh, PrintWorkLogs, PrintDC } from "../components";

function WorkLog() {
  const [contract, setContract] = useState();
  const [activeForm, setActiveForm] = useState(null);
  const [pending, setPending] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fn() {
      const actionResult = await dispatch(getSingleContract(id));
      const result = await unwrapResult(actionResult);
      setContract(result.result);
    }
    fn();
  }, [dispatch, id]);
  async function handleRefresh() {
    setPending(true);
    await dispatch(getSingleContract(id));
    setPending(false);
  }
  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="h-16 text-lg flex items-center justify-between font-medium bg-[#6FDCE3] border border-black rounded-tl-lg rounded-br-lg mb-2">
        <div className="m-2">
          <Refresh loading={pending} onRefresh={handleRefresh} />
        </div>
        <div className="flex-grow mr-4 flex items-center justify-evenly ">
          <div className="flex items-center justify-center">
            <h3>Select an action to proceed</h3>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setActiveForm("dc")}
          className={`mx-2 ${
            activeForm === "dc" ? "bg-blue-600 text-white" : null
          }`}
        >
          Make DC
        </Button>
        <Button
          onClick={() => setActiveForm("worklog")}
          className={`mx-2 ${
            activeForm === "worklog" ? "bg-blue-600 text-white" : null
          }`}
        >
          Add Worklog
        </Button>
      </div>
      {activeForm === "dc" && (
        <PrintDC id={contract?._id} quoteInfo={contract?.quoteInfo} />
      )}
      {activeForm === "worklog" && (
        <PrintWorkLogs id={contract?._id} quoteInfo={contract?.quoteInfo} />
      )}
    </div>
  );
}

export default WorkLog;
