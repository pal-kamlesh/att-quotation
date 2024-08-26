import { unwrapResult } from "@reduxjs/toolkit";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getWorklogs } from "../redux/contract/contractSlice";
import CustomModal from "./CustomModal";
import WorklogForm from "./WorklogForm";

// eslint-disable-next-line react/prop-types
function PrintWorkLogs({ id, quoteInfo }) {
  const [workLogs, setWorkLogs] = useState([]);
  const [form, setForm] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    //fetch workLogs
    async function fetch() {
      const actionResult = await dispatch(getWorklogs(id));
      const result = unwrapResult(actionResult);
      setWorkLogs(result.result.worklogs);
      console.log("We got called!");
    }
    fetch();
  }, [dispatch, id]);
  return (
    <div className=" max-w-[1400px] mx-auto  ">
      <h4 className="text-lg font-semibold mb-2">Worklogs</h4>
      <Button onClick={() => setForm(true)}>Make Worklog</Button>
      <div className="grid grid-cols-12  gap-4">
        {workLogs?.map((log) => (
          <div
            key={log._id}
            className="flex flex-col p-4 bg-gray-100 rounded-lg col-span-3"
          >
            <div className="mb-2">
              <p className="font-semibold">{log.workAreaType}</p>
              <p>Chemical: {log.chemical}</p>
              <p>Quantity: {log.chemicalUsed}</p>
              <p>
                Area Treated: {log.areaTreated} {log.areaTreatedUnit}
              </p>
              {log.remark && <p>Remark: {log.remark}</p>}
            </div>
            <div className="flex justify-between">
              {/* <Button size="sm">Edit</Button>
              <Button size="sm" color="failure">
                Delete
              </Button> */}
            </div>
          </div>
        ))}
      </div>
      <CustomModal
        isOpen={form}
        onClose={() => setForm(!form)}
        heading="New Quotation"
        bg="bg-teal-50"
      >
        <WorklogForm id={id} quoteInfo={quoteInfo} />
      </CustomModal>
    </div>
  );
}

export default PrintWorkLogs;
