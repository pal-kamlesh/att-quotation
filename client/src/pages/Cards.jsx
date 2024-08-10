import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../redux/user/userSlice";
import { Button, Table } from "flowbite-react";
import { Loading, Refresh, SearchContract, PopUp } from "../components";
import TimeAgo from "react-timeago";
import { toast } from "react-toastify";
import { getDotColor } from "../funtions/funtion";
import { FcPrint } from "react-icons/fc";
import {
  incPrintCount,
  searchCards,
  showMoreCard,
} from "../redux/card/cardSlice";

function Cards() {
  const { cards = [], showMore, loading } = useSelector((state) => state.card);
  const [extraQuery, setExtraQuery] = useState("&approved=true");
  const [pending, setPending] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cards.length <= 0) {
      dispatch(getInitials());
      dispatch(searchCards("&approved=true"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRefresh() {
    setPending(true);
    await dispatch(searchCards("&approved=true"));
    setPending(false);
  }
  async function handleShowMore() {
    const startIndex = cards.length;
    if (!showMore) {
      toast.error("No more data.");
      return;
    }
    if (showMore && extraQuery) {
      dispatch(showMoreCard({ startIndex, extraQuery }));
    } else {
      dispatch(showMoreCard({ startIndex, extraQuery }));
      setExtraQuery("&approved=true");
    }
  }
  return (
    <div className=" max-w-[1400px] mx-auto ">
      {loading ? <Loading /> : null}
      <div className="h-full mt-3">
        <div className=" mt-2 h-full">
          <div className="h-16 text-lg flex items-center justify-between font-medium bg-[#F6E96B] border border-black rounded-tl-lg rounded-br-lg">
            <div className="m-2">
              <Refresh loading={pending} onRefresh={handleRefresh} />
            </div>
            <div className="flex-grow mr-4 flex items-center justify-evenly ">
              <div className="flex items-center justify-center">
                <h3>Recent cards</h3>
              </div>
            </div>
            <div>
              <button className="bg-[#A2CA71] hover:bg-[#BEDC74] font-medium py-2 px-4 rounded-tl-lg rounded-br-lg mr-2">
                Cards
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
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {cards.length > 0 &&
                  cards.map((contract) => (
                    <Table.Row key={contract._id} className=" border-b-2">
                      <Table.Cell>
                        <div className="flex items-center justify-start w-full gap-1 ">
                          <PopUp
                            id={contract._id}
                            approved={contract.approved}
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
                        <div className="flex items-center justify-evenly flex-wrap gap-1 relative">
                          <div
                            className={`absolute top-0 left-0 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${getDotColor(
                              contract.docType
                            )}`}
                          ></div>
                          <Button
                            color="gray"
                            onClick={() =>
                              dispatch(incPrintCount(contract._id))
                            }
                          >
                            <FcPrint className="h-6 w-6" />
                            <div className="cursor-pointer text-gray-800 font-semibold hover:text-gray-600">
                              {contract.printCount}
                            </div>
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
            {cards.length <= 0 && (
              <h1 className="text-center">
                No cards
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
    </div>
  );
}

export default Cards;