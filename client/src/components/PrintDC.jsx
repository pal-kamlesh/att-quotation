import { unwrapResult } from "@reduxjs/toolkit";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getdcs } from "../redux/contract/contractSlice";
import { CustomModal, DCForm } from "../components/index.js";
// eslint-disable-next-line react/prop-types
function PrintDC({ id, quoteInfo }) {
  const [dcs, setDCs] = useState([]);
  const [form, setForm] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    //fetch workLogs
    async function fetch() {
      const actionResult = await dispatch(getdcs(id));
      const result = unwrapResult(actionResult);
      setDCs(result.result.dcs);
    }
    fetch();
  }, [dispatch, id]);
  return (
    <div className=" max-w-[1400px] mx-auto  ">
      <h4 className="text-lg font-semibold mb-2">DC s</h4>
      <Button onClick={() => setForm(true)}>Make DC</Button>
      <div className="grid grid-cols-12  gap-4">
        {dcs?.map((log) => (
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
        heading="WorkLogs Entry"
        bg="bg-teal-50"
      >
        <DCForm
          id={id}
          quoteInfo={quoteInfo}
          setDCs={setDCs}
          onClose={() => setForm(!form)}
        />
      </CustomModal>
    </div>
  );
}

export default PrintDC;
