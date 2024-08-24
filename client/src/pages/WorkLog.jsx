import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getSingleContract } from "../redux/contract/contractSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { DCForm } from "../components";
import PrintWorkLogs from "../components/PrintWorkLogs";

function WorkLog() {
  const [contract, setContract] = useState();
  const [activeForm, setActiveForm] = useState(null);
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

  return (
    <div>
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold">Select an action to proceed</h1>
      </header>
      <div className="flex justify-center mb-6">
        <Button onClick={() => setActiveForm("dc")} className="mx-2">
          Make DC
        </Button>
        <Button onClick={() => setActiveForm("worklog")} className="mx-2">
          Add Worklog
        </Button>
      </div>

      {activeForm === "dc" && <DCForm quoteInfo={contract?.quoteInfo} />}
      {activeForm === "worklog" && (
        <PrintWorkLogs id={contract?._id} quoteInfo={contract?.quoteInfo} />
      )}
    </div>
  );
}

export default WorkLog;
