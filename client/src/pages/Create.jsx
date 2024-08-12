import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import TimeAgo from "react-timeago";
import {
  CustomModal,
  Diff,
  Loading,
  NewQuote,
  PopUp2,
  Refresh,
  ViewQuote,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../redux/user/userSlice";
import {
  getQuotes,
  approve,
  showMoreQuotes,
  makeContract,
} from "../redux/quote/quoteSlice";
import { SearchQuote } from "../components/index.js";
import Update from "./Update";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import PopUp from "../components/PopUp";
import { getDotColor } from "../funtions/funtion";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const {
    quotations = [],
    loading,
    showMore,
  } = useSelector((state) => state.quote);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [createModel, setCreateModel] = useState(false);
  const [viewModel, setViewModel] = useState(false);
  const [updateModel, setUpdateModel] = useState(false);
  const [archiveModel, setArchiveModel] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [quoteNo, setQuoteNo] = useState("");
  const [extraQuery, setExtraQuery] = useState(null);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (quotations.length <= 0) {
      dispatch(getInitials());
      dispatch(getQuotes());
    }
  }, [dispatch, quotations.length]);
  useEffect(() => {
    if (currentUser.rights.createQuote || currentUser.rights.admin) {
      return;
    } else {
      navigate("/");
    }
  }, [
    currentUser.rights.admin,
    currentUser.rights.createQuote,
    dispatch,
    navigate,
  ]);

  async function handleClick(id) {
    if (!currentUser.rights.admin) {
      toast.error("Contact VNT to approve the Quotation.");
      return;
    }
    const actionResult = await dispatch(approve(id));
    // eslint-disable-next-line no-unused-vars
    const result = unwrapResult(actionResult);
  }
  async function handleShowMore() {
    const startIndex = quotations.length;
    if (!showMore) {
      toast.error("No more data.");
      return;
    }
    if (showMore && extraQuery) {
      dispatch(showMoreQuotes({ startIndex, extraQuery }));
    } else {
      dispatch(showMoreQuotes({ startIndex, extraQuery }));
      setExtraQuery(null);
    }
  }
  async function handleContractify(id) {
    try {
      dispatch(makeContract(id));
    } catch (error) {
      console.log(error);
    }
  }
  async function handleRefresh() {
    setPending(true);
    await dispatch(getQuotes());
    setPending(false);
  }
  return (
    <div className=" max-w-[1400px] mx-auto ">
      {loading ? <Loading /> : null}
      <div className="h-full mt-3">
        <div className=" mt-2 h-full">
          <div className="h-16 text-lg flex items-center justify-between font-medium bg-[#6FDCE3] border border-black rounded-tl-lg rounded-br-lg">
            <div className="m-2">
              <Refresh loading={pending} onRefresh={handleRefresh} />
            </div>
            <div className="flex-grow mr-4 flex items-center justify-evenly ">
              <div className="flex items-center justify-center">
                <h3>Recent Quotations</h3>
              </div>
            </div>
            <div>
              <button
                className="bg-[#FFFDB5] hover:bg-yellow-200 font-medium py-2 px-4 rounded-tl-lg rounded-br-lg mr-2"
                onClick={() => setCreateModel(true)}
              >
                Create Quotation
              </button>
            </div>
          </div>
          <div>
            <SearchQuote setExtraQuery={setExtraQuery} />
          </div>
          <div className=" overflow-x-auto ">
            <Table>
              <Table.Head>
                <Table.HeadCell>Quotation No</Table.HeadCell>
                <Table.HeadCell>Quotation Date</Table.HeadCell>
                <Table.HeadCell>Created By</Table.HeadCell>
                <Table.HeadCell>Project Name</Table.HeadCell>
                <Table.HeadCell>Client Name</Table.HeadCell>
                <Table.HeadCell>Timestamp</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {quotations.length > 0 &&
                  quotations.map((ticket) => (
                    <Table.Row key={ticket._id} className=" border-b-2">
                      <Table.Cell>
                        <div className="flex items-center justify-start w-full gap-1 ">
                          <PopUp
                            click={handleClick}
                            id={ticket._id}
                            approved={ticket.approved}
                          />
                          {ticket.quotationNo ? ticket.quotationNo : ticket._id}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(ticket.quotationDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </Table.Cell>
                      <Table.Cell>{ticket.createdBy?.username}</Table.Cell>
                      <Table.Cell>
                        {ticket.shipToAddress.projectName}
                      </Table.Cell>
                      <Table.Cell>{ticket.billToAddress.name}</Table.Cell>
                      <Table.Cell>
                        <TimeAgo date={new Date(ticket.updatedAt)} />
                      </Table.Cell>
                      <Table.Cell>
                        {ticket.contractified ? (
                          <Button gradientDuoTone="redToYellow" disabled>
                            Contract
                          </Button>
                        ) : (
                          <Button
                            outline
                            gradientDuoTone="redToYellow"
                            onClick={() => [
                              setQuoteId(ticket._id),
                              setQuoteNo(ticket.quotationNo),
                              setUpdateModel(true),
                            ]}
                          >
                            {ticket.approved ? (
                              <span>Revise</span>
                            ) : (
                              <span>Edit</span>
                            )}
                          </Button>
                        )}
                      </Table.Cell>
                      <Table.Cell className="border ">
                        <div className="flex items-center justify-evenly flex-wrap gap-1 relative">
                          <div
                            className={`absolute top-0 left-0 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${getDotColor(
                              ticket.docType
                            )}`}
                          ></div>
                          <Button
                            gradientDuoTone="purpleToBlue"
                            onClick={() => [
                              setViewModel(true),
                              setQuoteId(ticket._id),
                              setQuoteNo(ticket.quotationNo),
                            ]}
                          >
                            View
                          </Button>
                          {ticket.approved && ticket.emailTo ? (
                            <Button gradientDuoTone="greenToBlue">Email</Button>
                          ) : null}

                          {ticket.approved && !ticket.contractified ? (
                            <Button
                              gradientMonochrome="purple"
                              onClick={() => handleContractify(ticket._id)}
                            >
                              Make Contract
                            </Button>
                          ) : null}

                          {ticket.approved ? (
                            <Button
                              onClick={() => [
                                setArchiveModel(true),
                                setQuoteId(ticket._id),
                                setQuoteNo(ticket.quotationNo),
                              ]}
                              gradientDuoTone="tealToLime"
                            >
                              History
                            </Button>
                          ) : null}
                          <PopUp2
                            id={ticket._id}
                            disabled={ticket.contractified}
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
            {quotations.length <= 0 && (
              <h1 className="text-center">
                No Quotation
                <span style={{ fontSize: "60px" }}>&#128524;</span>
              </h1>
            )}
          </div>
        </div>
      </div>
      {showMore && (
        <div className="flex items-center justify-center p-1">
          <Button gradientDuoTone="purpleToPink" pill onClick={handleShowMore}>
            Show more
          </Button>
        </div>
      )}
      <CustomModal
        isOpen={createModel}
        onClose={() => setCreateModel(!createModel)}
        size="7xl"
        heading="New Quotation"
        bg="bg-teal-50"
      >
        <NewQuote onClose={() => setCreateModel(!createModel)} />
      </CustomModal>
      <CustomModal
        isOpen={viewModel}
        onClose={() => setViewModel(!viewModel)}
        size="7xl"
        heading={
          <div className="flex items-center justify-center">
            <span>View/Edit</span>
            {quoteNo ? (
              <span className="ml-5">{quoteNo}</span>
            ) : (
              <span className="ml-5">{quoteId}</span>
            )}
          </div>
        }
      >
        <ViewQuote quoteId={quoteId} />
      </CustomModal>
      <CustomModal
        isOpen={updateModel}
        onClose={() => setUpdateModel(!updateModel)}
        size="7xl"
        heading={
          <div className="flex items-center justify-center">
            <span>View/Edit</span>
            {quoteNo ? (
              <span className="ml-5">{quoteNo}</span>
            ) : (
              <span className="ml-5">{quoteId}</span>
            )}
          </div>
        }
      >
        <Update
          quoteId={quoteId}
          onClose={() => setUpdateModel(!updateModel)}
        />
      </CustomModal>
      <CustomModal
        isOpen={archiveModel}
        onClose={() => setArchiveModel(!archiveModel)}
        size="7xl"
        heading={
          <div className="flex items-center justify-center">
            <span>View/Edit</span>
            {quoteNo ? (
              <span className="ml-5">{quoteNo}</span>
            ) : (
              <span className="ml-5">{quoteId}</span>
            )}
          </div>
        }
      >
        <Diff
          quoteId={quoteId}
          onClose={() => setArchiveModel(!archiveModel)}
        />
      </CustomModal>
    </div>
  );
}
