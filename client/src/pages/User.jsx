import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUsers,
  register,
  updateUser,
  deleteUser,
} from "../redux/user/userSlice";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import { unwrapResult } from "@reduxjs/toolkit";

const userInit = {
  username: "",
  prefix: "",
  initials: "",
  password: "",
  rights: {
    createQuote: false,
    createContract: false,
    genCard: false,
    workLogUpdate: false,
    approve: false,
    admin: false,
  },
};
export default function User() {
  const { currentUser, allUsers } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(userInit);
  const [openModal, setOpenModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [rights, setRights] = useState([]);

  function onCloseModal() {
    setOpenModal(false);
  }

  useEffect(() => {
    setRights(Object.keys(userInit.rights));
  }, [setRights]);

  useEffect(() => {
    if (!currentUser.rights.admin) {
      navigate("/");
    } else {
      dispatch(getUsers());
    }
  }, [currentUser, navigate, dispatch]);

  const handleRights = (e) => {
    if (e.target.checked) {
      setUser((prev) => ({
        ...prev,
        rights: {
          ...prev.rights,
          [e.target.id]: true,
        },
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        rights: {
          ...prev.rights,
          [e.target.id]: false,
        },
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerUser = async () => {
    const resultAction = await dispatch(register(user));
    // eslint-disable-next-line no-unused-vars
    const result = unwrapResult(resultAction);
    onCloseModal();
    setUser(userInit);
  };
  const handleUpdateUser = async () => {
    const resultAction = await dispatch(updateUser(user));
    // eslint-disable-next-line no-unused-vars
    const result = unwrapResult(resultAction);
    onCloseModal();
    setUpdate(false);
    setUser(userInit);
  };
  const deleteIt = (id) => {
    dispatch(deleteUser(id));
  };
  function splitByCapitalLetters(text) {
    // Use a regular expression to split by capital letters
    const splitArray = text.split(/(?=[A-Z])/).filter(Boolean);

    // Capitalize the first character of the first word
    if (splitArray.length > 0) {
      splitArray[0] =
        splitArray[0].charAt(0).toUpperCase() + splitArray[0].slice(1);
    }

    // Join the array with spaces in between
    return splitArray.join(" ");
  }

  return (
    <div className="max-w-7xl mx-auto ">
      <div className=" mt-3 h-full">
        <div className="h-16 text-lg flex items-center justify-between font-medium bg-[#6FDCE3] border border-black rounded-tl-lg rounded-br-lg">
          <div className="flex-grow mr-4 ">
            <div className="flex items-center justify-center">
              <h3>All Users</h3>
            </div>
          </div>
          <div>
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#FFFDB5] hover:bg-yellow-200 font-medium py-2 px-4 rounded mr-2"
            >
              New User
            </button>
          </div>
        </div>
        <div className=" overflow-x-auto ">
          <Table>
            <Table.Head>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Rights</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {allUsers.length > 0 &&
                allUsers.map((user) => (
                  <Table.Row
                    key={user._id}
                    className={
                      currentUser._id === user._id ? "bg-gray-100" : ""
                    }
                  >
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell className="border">
                      <div className="flex items-center justify-around flex-wrap">
                        <div className="grid grid-cols-12">
                          {rights.map((right, idx) => (
                            <div className="mr-2 col-span-2" key={idx}>
                              <div className="">
                                <Label
                                  htmlFor={right}
                                  value={splitByCapitalLetters(right)}
                                />
                              </div>
                              <Checkbox
                                disabled
                                id={right}
                                value={right}
                                checked={user.rights[right]}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="border">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <Button
                          pill
                          color="yellow"
                          onClick={() => [
                            setOpenModal(true),
                            setUser(user),
                            setUpdate(true),
                          ]}
                        >
                          Edit
                        </Button>
                        <Button
                          pill
                          color={user.active ? "failure" : "success"}
                          onClick={() =>
                            dispatch(
                              updateUser({ ...user, active: !user.active })
                            )
                          }
                        >
                          {user.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          pill
                          color="red"
                          onClick={() => deleteIt(user._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => [onCloseModal(), setUpdate(false), setUser(userInit)]}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {update ? "Update User" : "Create User"}
            </h3>
            <div className=" w-full grid grid-cols-12">
              <div className="col-span-3">
                <div className="mb-2 block">
                  <Label htmlFor="prefix" value="Prefix" />
                </div>
                <Select
                  id="prefix"
                  name="prefix"
                  value={user.prefix}
                  onChange={handleChange}
                  required
                >
                  <option></option>
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                  <option>Miss</option>
                  <option>Master</option>
                  <option>Dr.</option>
                  <option>Rev.</option>
                  <option>Prof.</option>
                  <option>Hon.</option>
                  <option>Sir</option>
                </Select>
              </div>

              <div className=" col-span-9">
                <div className="mb-2 block">
                  <Label htmlFor="username" value="Enter Username" />
                </div>
                <TextInput
                  id="username"
                  name="username"
                  placeholder="username..."
                  value={user.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="initials" value="Enter Initials" />
              </div>
              <TextInput
                id="initials"
                name="initials"
                placeholder="Name Initials..."
                value={user.initials}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Enter password" />
              </div>
              <TextInput
                id="password"
                name="password"
                placeholder="********"
                type="text"
                value={user.password}
                required
                onChange={handleChange}
              />
            </div>
            <div className="block font-bold">
              <Label value="User Rights" />
            </div>
            <div className="w-full flex items-center justify-center border rounded-lg">
              <div className="grid grid-cols-12 flex-wrap gap-2 p-1 ">
                {rights.map((right, idx) => (
                  <div key={idx} className=" col-span-4">
                    <div className="mb-2 block">
                      <Label
                        htmlFor={right}
                        value={splitByCapitalLetters(right)}
                      />
                    </div>
                    <Checkbox
                      id={right}
                      value={right}
                      checked={user.rights[right]}
                      onClick={(e) => handleRights(e)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-300">
              <Button
                onClick={() => (update ? handleUpdateUser() : registerUser())}
              >
                {update ? "Edit User" : "Create User"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
