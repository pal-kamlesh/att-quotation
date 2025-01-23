import { useState } from "react";
import { Button, Label, Select, Spinner, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { searchQuotes } from "../redux/quote/quoteSlice";
import { useLocation } from "react-router-dom";
import { searchContracts } from "../redux/contract/contractSlice";
import { searchCards } from "../redux/card/cardSlice";

// eslint-disable-next-line react/prop-types
const Search = ({ setExtraQuery }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [createdBy, setCreatedBy] = useState("");
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { initials } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    let query = "";

    if (createdBy) {
      query += `&createdBy=${createdBy}`;
    }

    if (projectName !== "") {
      query += `&projectName=${projectName}`;
    }
    if (clientName !== "") {
      query += `&clientName=${clientName}`;
    }

    if (fromDate !== "") {
      query += `&fromDate=${fromDate}`;
    }
    if (toDate !== "") {
      query += `&toDate=${toDate}`;
    }

    if (quotationNo !== "") {
      query += `&quotationNo=${quotationNo}`;
    }

    try {
      setLoading(true);
      console.log(pathname);
      const resultAction =
        pathname === "/quotes"
          ? await dispatch(searchQuotes(query.slice(1)))
          : pathname === "/contracts"
          ? await dispatch(searchContracts(query.slice(1)))
          : await dispatch(searchCards(query.slice(1)));
      setExtraQuery(query.slice(1));
      // eslint-disable-next-line no-unused-vars
      const result = unwrapResult(resultAction);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching tickets:", error);
    }
  };
  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center  sm:justify-evenly  pr-6 flex-wrap">
        <div>
          <Label htmlFor="quotationNo" className="font-bold text-blue-600">
            Quotation No
          </Label>
          <div className="flex items-center justify-center">
            <TextInput
              type="text"
              name="quotationNo"
              id="quotationNo"
              value={quotationNo}
              onChange={(e) => setQuotationNo(e.target.value)}
            />
          </div>
        </div>
        <div className="">
          <Label htmlFor="createdBy" className="font-bold text-blue-600">
            Created By
          </Label>
          <div className="flex items-center justify-center">
            <Select
              name="createdBy"
              id="createdBy"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            >
              <option></option>
              {initials.length > 0 &&
                initials.map((initial) => (
                  <option value={initial._id} key={initial._id}>
                    {initial.initials} {initial.username}
                  </option>
                ))}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="projectName" className=" font-bold text-blue-600">
            Project Name
          </Label>
          <div className="flex items-center justify-center">
            <TextInput
              type="text"
              value={projectName}
              name="projectName"
              id="projectName"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="projectName" className=" font-bold text-blue-600">
            Client Name
          </Label>
          <div className="flex items-center justify-center">
            <TextInput
              type="text"
              value={clientName}
              name="clientName"
              id="clientName"
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="" className="font-bold text-blue-600">
            Quotation Date/From
          </Label>
          <div className="flex items-center justify-center">
            <input
              type="date"
              value={fromDate}
              name="fromDate"
              id="fromDate"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setFromDate(e.target.value)}
            ></input>
          </div>
        </div>
        <div>
          <Label htmlFor="" className="font-bold text-blue-600">
            Quotation Date/To
          </Label>
          <div className="flex items-center justify-center">
            <input
              type="date"
              value={toDate}
              name="toDate"
              id="toDate"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setToDate(e.target.value)}
            ></input>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-2">
        <Button gradientDuoTone="redToYellow" onClick={handleSearch}>
          {loading ? (
            <div className="flex items-center justify-center">
              <span className=" pr-3">Searching...</span>
              <Spinner size="sm" />
            </div>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Search;
