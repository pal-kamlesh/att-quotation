import { useEffect, useState } from "react";
import {
  CustomModal,
  Loading,
  NewContract,
  PopUpContract,
  Refresh,
  SearchContract,
  UpdateContract,
  ViewContract,
  PopUp,
  QRbutton,
} from "../components/index.js";
import TimeAgo from "react-timeago";
import { Button, Table } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../redux/user/userSlice.js";
import {
  approve,
  getContracts,
  showMoreContract,
} from "../redux/contract/contractSlice.js";
import { toast } from "react-toastify";
import { getDotColor } from "../funtions/funtion.js";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

function Contracts() {
  const {
    contracts = [],
    showMore,
    loading,
  } = useSelector((state) => state.contract);
  const { currentUser } = useSelector((state) => state.user);
  const [extraQuery, setExtraQuery] = useState();
  const [createModel, setCreateModel] = useState(false);
  const [updateModel, setUpdateModel] = useState(false);
  const [viewModel, setViewModel] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [pending, setPending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleShowMore() {
    const startIndex = contracts.length;
    if (!showMore) {
      toast.error("No more data.");
      return;
    }
    if (showMore && extraQuery) {
      dispatch(showMoreContract({ startIndex, extraQuery }));
    } else {
      dispatch(showMoreContract({ startIndex, extraQuery }));
      setExtraQuery(null);
    }
  }
  useEffect(() => {
    if (contracts.length <= 0) {
      dispatch(getInitials());
      dispatch(getContracts());
    }
  }, [dispatch, contracts.length]);

  useEffect(() => {
    if (currentUser.rights.createContract || currentUser.rights.admin) {
      return;
    } else {
      navigate("/");
    }
  }, [
    currentUser.rights.admin,
    currentUser.rights.createContract,
    dispatch,
    navigate,
  ]);
  async function handleRefresh() {
    setPending(true);
    await dispatch(getContracts());
    setPending(false);
  }

  async function handleClick(id) {
    if (!currentUser.rights.admin && !currentUser.rights.approve) {
      toast.error("Contact VNT to approve the Quotation.");
      return;
    }
    const actionResult = await dispatch(approve(id));
    // eslint-disable-next-line no-unused-vars
    const result = unwrapResult(actionResult);
  }
  return (
    <div className=" max-w-[1400px] mx-auto ">
      {loading ? <Loading /> : null}
      <div className="h-full mt-3">
        <div className=" mt-2 h-full">
          <div className="h-16 text-lg flex items-center justify-between font-medium bg-[#E36F6F] border border-black rounded-tl-lg rounded-br-lg">
            <div className="m-2">
              <Refresh loading={pending} onRefresh={handleRefresh} />
            </div>
            <div className="flex-grow mr-4 flex items-center justify-evenly ">
              <div className="flex items-center justify-center">
                <h3>Recent Contracts</h3>
              </div>
            </div>
            <div>
              <button
                className="bg-[#FFFDB5] hover:bg-yellow-200 font-medium py-2 px-4 rounded-tl-lg rounded-br-lg mr-2"
                onClick={() => setCreateModel(true)}
              >
                Create Contracts
              </button>
            </div>
          </div>
          <div>
            <SearchContract setExtraQuery={setExtraQuery} />
          </div>
          <div className=" overflow-x-auto ">
            <Table>
              <Table.Head>
                <Table.HeadCell>Contract No</Table.HeadCell>
                <Table.HeadCell>Contract Date</Table.HeadCell>
                <Table.HeadCell>Created By</Table.HeadCell>
                <Table.HeadCell>Project Name</Table.HeadCell>
                <Table.HeadCell>Client Name</Table.HeadCell>
                <Table.HeadCell>Timestamp</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {contracts.length > 0 &&
                  contracts.map((contract) => (
                    <Table.Row key={contract._id} className=" border-b-2">
                      <Table.Cell>
                        <div className="flex items-center justify-start w-full gap-1 ">
                          <PopUp
                            id={contract._id}
                            cNo={contract.contractNo}
                            approved={contract.approved}
                            click={handleClick}
                          />
                          {contract.contractNo
                            ? contract.contractNo
                            : contract._id}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(contract.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </Table.Cell>
                      <Table.Cell>{contract.createdBy?.username}</Table.Cell>
                      <Table.Cell>
                        {contract.shipToAddress.projectName}
                      </Table.Cell>
                      <Table.Cell>{contract.billToAddress.name}</Table.Cell>
                      <Table.Cell>
                        <TimeAgo date={new Date(contract.updatedAt)} />
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          outline
                          gradientDuoTone="redToYellow"
                          onClick={() => [
                            setUpdateModel(true),
                            setActiveId(contract._id),
                          ]}
                        >
                          {contract.approved ? (
                            <span>Revise</span>
                          ) : (
                            <span>Update</span>
                          )}
                        </Button>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center justify-evenly flex-wrap gap-1 relative">
                          <div
                            className={`absolute top-0 left-0 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${getDotColor(
                              contract.docType
                            )}`}
                          ></div>
                          <Button
                            gradientDuoTone="purpleToBlue"
                            onClick={() => [
                              setViewModel(true),
                              setActiveId(contract._id),
                            ]}
                          >
                            View
                          </Button>
                          <PopUpContract id={contract._id} />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
            {contracts.length <= 0 && (
              <h1 className="text-center">
                No Contracts
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
        heading="New Contract"
        bg="bg-red-50"
      >
        <NewContract
          onClose={() => setCreateModel(!createModel)}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </CustomModal>
      <CustomModal
        isOpen={updateModel}
        onClose={() => setUpdateModel(!updateModel)}
        size="7xl"
        heading="Update Contract"
        bg="bg-red-50"
      >
        <UpdateContract
          onClose={() => setUpdateModel(!updateModel)}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </CustomModal>
      <CustomModal
        isOpen={viewModel}
        onClose={() => setViewModel(!viewModel)}
        size="7xl"
        heading={
          <div className="flex gap-3 items-center justify-center">
            <span>View/Edit</span>
            <QRbutton
              id={activeId}
              data={contracts.find((c) => c._id === activeId)}
            />
          </div>
        }
      >
        <ViewContract id={activeId} />
      </CustomModal>
    </div>
  );
}

export default Contracts;
