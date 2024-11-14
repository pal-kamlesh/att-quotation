import { unwrapResult } from "@reduxjs/toolkit";
import { Button } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getdcs } from "../redux/contract/contractSlice";
import { CustomModal, DCForm } from "../components/index.js";
import TestChalan from "../pages/TestChalan.jsx";
import html2canvas from "html2canvas";
import { getFormattedDateTime } from "../funtions/funtion.js";

// eslint-disable-next-line react/prop-types
function PrintDC({ id, contract }) {
  const [dcs, setDCs] = useState([]);
  const [form, setForm] = useState(false);
  const [detailModel, setDetailModel] = useState(false);
  const [selectedDc, setSelectedDc] = useState(null);
  const dispatch = useDispatch();
  const componentRef = useRef(null);

  useEffect(() => {
    //fetch workLogs
    async function fetch() {
      const actionResult = await dispatch(getdcs(id));
      const result = unwrapResult(actionResult);
      setDCs(result.result.dcs);
    }
    fetch();
  }, [dispatch, id]);

  const openWorklogModal = (log) => {
    setSelectedDc(log);
    setDetailModel(true);
  };

  const captureComponent = async () => {
    const element = componentRef.current;
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `DC_${getFormattedDateTime()}.png`;
      link.click();
    });
  };

  return (
    <div className=" max-w-[1400px] mx-auto p-4 ">
      <h4 className="text-lg font-semibold mb-2">DC (Delivery Chalan)</h4>
      <Button onClick={() => setForm(true)}>Add New</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {dcs?.map((log) => (
          <div
            key={log?._id}
            className={`p-4 bg-gray-100 rounded-lg cursor-pointer border transition-all duration-300 ease-in-out ${
              selectedDc?._id === log._id
                ? "border-blue-500 shadow-lg transform scale-105"
                : "border-blue-300"
            }`}
            onClick={() => openWorklogModal(log)}
          >
            <div className="font-semibold flex items-center justify-start w-full gap-4">
              <p>Date: {new Date(log.createdAt).toLocaleDateString()}</p>
              <p>Time: {new Date(log.createdAt).toLocaleDateString()}</p>
            </div>
            <p>Entry By: {log?.entryBy?.username}</p>
          </div>
        ))}
      </div>
      <CustomModal
        isOpen={detailModel}
        onClose={() => [setDetailModel(false), setSelectedDc(null)]}
        heading="DC Details"
        bg="bg-gray-50"
        size="3xl"
      >
        {selectedDc && (
          <>
            <div ref={componentRef}>
              <TestChalan selectedDc={selectedDc} contract={contract} />
            </div>
            <Button onClick={captureComponent}>Print</Button>
          </>
        )}
      </CustomModal>
      <CustomModal
        isOpen={form}
        onClose={() => setForm(!form)}
        heading="WorkLogs Entry"
        bg="bg-teal-50"
      >
        <DCForm
          id={id}
          contract={contract}
          setDCs={setDCs}
          onClose={() => setForm(!form)}
        />
      </CustomModal>
    </div>
  );
}

export default PrintDC;
