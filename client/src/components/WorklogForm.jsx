/* eslint-disable react/prop-types */
import {
  Button,
  Textarea,
  TextInput,
  Label,
  Card,
  Select,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  21
);

function WorklogForm({ quoteInfo }) {
  const [validInput, setValidInput] = useState(false);
  const [worklogArray, setWorklogArray] = useState([]);
  const [worklogObj, setWorklogObj] = useState({
    _id: nanoid(),
    workAreaType: "",
    chemical: "",
    chemicalUsed: "",
    remark: "",
  });

  useEffect(() => {
    if (
      worklogObj.workAreaType !== "" &&
      worklogObj.chemical !== "" &&
      worklogObj.chemicalUsed !== ""
    ) {
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  }, [worklogObj]);

  function handleWorklogChange(e) {
    const { name, value } = e.target;
    setWorklogObj((prev) => ({ ...prev, [name]: value }));
  }

  function deleteWorklog(id) {
    setWorklogArray((prev) => prev.filter((info) => info._id !== id));
  }

  function editWorklog(id) {
    const info = worklogArray.find((el) => el._id === id);
    setWorklogObj(info);
    deleteWorklog(id);
  }

  function moreWorklog() {
    if (validInput) {
      setWorklogArray((prev) => [...prev, worklogObj]);
      setWorklogObj({
        _id: nanoid(),
        workAreaType: "",
        chemical: "",
        chemicalUsed: "",
        remark: "",
      });
      toast.success("Worklog added successfully!");
    } else {
      toast.error("Please fill in all required fields.");
    }
  }

  return (
    <Card className="max-w-md mx-auto p-6">
      <h3 className="text-xl font-semibold text-center mb-4">Worklog Form</h3>
      <form className="space-y-4">
        <div>
          <Label htmlFor="workAreaType" value="Work Area Type" />
          <Select
            id="workAreaType"
            name="workAreaType"
            placeholder="Enter work area type"
            value={worklogObj.workAreaType}
            onChange={handleWorklogChange}
            required
          >
            <option></option>
            {quoteInfo.map((info) => (
              <option key={info._id}>{info.workAreaType}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="chemical" value="Chemical" />
          <Select
            id="chemical"
            name="chemical"
            placeholder="Enter chemical used"
            value={worklogObj.chemical}
            onChange={handleWorklogChange}
            required
          >
            <option></option>
            {quoteInfo.map((info) => (
              <option key={info._id}>{info.chemical}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="chemicalUsed" value="Chemical Used (Quantity)" />
          <TextInput
            id="chemicalUsed"
            name="chemicalUsed"
            placeholder="Enter quantity used"
            value={worklogObj.chemicalUsed}
            onChange={handleWorklogChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="remark" value="Remark" />
          <Textarea
            id="remark"
            name="remark"
            placeholder="Enter any remarks"
            value={worklogObj.remark}
            onChange={handleWorklogChange}
            rows={3}
          />
        </div>
        <Button
          type="button"
          onClick={moreWorklog}
          fullSized
          disabled={!validInput}
        >
          Add Worklog
        </Button>
      </form>

      {worklogArray.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Worklogs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {worklogArray.map((log) => (
              <div
                key={log._id}
                className="flex flex-col p-4 bg-gray-100 rounded-lg"
              >
                <div className="mb-2">
                  <p className="font-semibold">{log.workAreaType}</p>
                  <p>Chemical: {log.chemical}</p>
                  <p>Quantity: {log.chemicalUsed}</p>
                  {log.remark && <p>Remark: {log.remark}</p>}
                </div>
                <div className="flex justify-between">
                  <Button size="sm" onClick={() => editWorklog(log._id)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="failure"
                    onClick={() => deleteWorklog(log._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default WorklogForm;
