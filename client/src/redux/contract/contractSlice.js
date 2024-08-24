import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  contracts: [],
  totalContracts: "",
  todayContracts: "",
  approvedCount: "",
  approvePending: "",
  loading: false,
  showMore: true,
};
export const uploadFiles = createAsyncThunk(
  "upload/files",
  async (data, { rejectWithValue }) => {
    try {
      const { file, name } = data;
      const images = Array.from(file);
      const form = new FormData();
      images.forEach((img) => {
        form.append("images", img);
      });

      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      result.name = name;
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const createContract = createAsyncThunk(
  "create/Contract",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/contract/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const createDC = createAsyncThunk(
  "create/DC",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/contract/create/dc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const createWorklog = createAsyncThunk(
  "create/worklog",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/contract/worklog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const getWorklogs = createAsyncThunk(
  "get/worklogs",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/contract/worklog/${data}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const showMoreContract = createAsyncThunk(
  "showMore/contracts",
  async ({ startIndex, extraQuery = "" }, { rejectWithValue }) => {
    try {
      let url = `/api/v1/contract/getcontracts?startIndex=${startIndex}`;
      if (extraQuery) {
        url += `&${extraQuery}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const getContracts = createAsyncThunk(
  "get/contracts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/contract/getContracts?${data}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const getSingleContract = createAsyncThunk(
  "get/singleQuote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/contract/${data}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const approve = createAsyncThunk(
  "approve/singleContract",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/contract/approve/${data}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const searchContracts = createAsyncThunk(
  "search/contracts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/contract/getContracts?${data}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const docxData = createAsyncThunk(
  "contract/docxdata",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/contract/docx/${data}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const archiveData = createAsyncThunk(
  "get/archivedata",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/quotation/archive/${data}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateContract = createAsyncThunk(
  "update/contract",
  async (data, { rejectWithValue }) => {
    const { id, contract, message } = data;
    try {
      const response = await fetch(`/api/v1/contract/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract, message }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    updateIssueField: (state, action) => {
      const { field, value } = action.payload;
      state.newTicket.issue[field] = value;
    },
    handleMode: (state, action) => {
      state.newTicket.complainMode = action.payload;
      state.newTicket.modeDetails = {
        email: {
          emailCopy: "",
        },
        phone: {
          date: "",
          number: "",
          callerDetails: "",
        },
        inspection: {
          inspector: "",
          assessment: "",
          images: [],
        },
      };
    },
    handlePhoneFilds: (state, action) => {
      const { field, value } = action.payload;
      state.newTicket.modeDetails.phone[field] = value;
    },
    handleInspection: (state, action) => {
      const { field, value } = action.payload;
      state.newTicket.modeDetails.inspection[field] = value;
    },
    setTickets: (state, action) => {
      const newData = [...state.tickets, ...action.payload];
      state.tickets = newData;
    },
    setCreator: (state, action) => {
      state.newTicket.createdBy = action.payload;
    },
    setSelectedService: (state, action) => {
      const existingObj = state.newTicket.contract.selectedServices.find(
        (service) =>
          service.name === action.payload.name &&
          service.serviceId === action.payload.serviceId
      );
      if (existingObj) {
        state.newTicket.contract.selectedServices =
          state.newTicket.contract.selectedServices.filter(
            (service) =>
              !(
                service.name === action.payload.name &&
                service.serviceId === action.payload.serviceId
              )
          );
      } else {
        state.newTicket.contract.selectedServices.push(action.payload);
      }
    },
    setInit: (state) => {
      state.newTicket = initialState.newTicket;
      state.services = initialState.services;
      state.loading = initialState.loading;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
        state.newTicket.modeDetails.email.emailCopy = "";
      })
      .addCase(uploadFiles.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.name === "email") {
          state.newTicket.modeDetails.email.emailCopy = payload.link;
        }
        if (payload.name === "inspection") {
          state.newTicket.modeDetails.inspection.images.push(payload.link);
        }
        if (payload.name === "ticketImage") {
          state.newTicket.ticketImage = payload.link;
        }
        toast.success(payload.message);
      })
      .addCase(uploadFiles.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(createContract.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContract.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.contracts.push(payload.result);
        state.contracts.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        state.todayContracts = state.todayContracts + 1;
        state.totalContracts = state.totalContracts + 1;
        toast.success(payload.message);
      })
      .addCase(createContract.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(showMoreContract.pending, (state) => {
        state.loading = true;
      })
      .addCase(showMoreContract.fulfilled, (state, { payload }) => {
        const newData = [...state.contracts, ...payload.result];
        state.loading = false;
        state.contracts = newData;
        if (payload.result.length < 9) {
          state.showMore = false;
        } else {
          state.showMore = true;
        }
      })
      .addCase(showMoreContract.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })

      .addCase(searchContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchContracts.fulfilled, (state, { payload }) => {
        state.contracts = payload.result;
        state.loading = false;
        state.todayContracts = payload.todayContracts;
        state.totalContracts = payload.totalContracts;
        state.approvedCount = payload.approvedCount;
        state.approvePending = payload.approvePending;
        if (payload.result.length < 9) {
          state.showMore = false;
        } else {
          state.showMore = true;
        }
      })
      .addCase(searchContracts.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(getContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContracts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.contracts = payload.result;
        state.todayQuotations = payload.todayQuotes;
        state.totalQuotations = payload.totalQuotes;
        state.approvedCount = payload.approvedCount;
        state.approvePending = payload.approvePending;
        if (payload.result.length < 9) {
          state.showMore = false;
        } else {
          state.showMore = true;
        }
      })
      .addCase(getContracts.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(getSingleContract.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleContract.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getSingleContract.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(approve.pending, (state) => {
        state.loading = true;
      })
      .addCase(approve.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.contracts = state.contracts.filter(
          (quote) => quote._id !== payload.result._id
        );
        state.contracts.push(payload.result);
        state.contracts.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        toast.success(payload.message);
      })
      .addCase(approve.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(docxData.pending, (state) => {
        state.loading = true;
      })
      .addCase(docxData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(docxData.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContract.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.contracts = state.contracts.filter(
          (contract) => contract._id !== payload.result._id
        );
        state.contracts.push(payload.result);
        state.contracts.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        state.totalContracts = state.totalContracts + 1;
        state.todayContracts = state.todayContracts + 1;
        toast.success(payload.message);
      })
      .addCase(updateContract.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(archiveData.pending, (state) => {
        state.loading = true;
      })
      .addCase(archiveData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(archiveData.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      });
  },
});
export const {
  updateIssueField,
  handleMode,
  handlePhoneFilds,
  handleInspection,
  setCreator,
  setSelectedService,
  setInit,
} = contractSlice.actions;

export default contractSlice.reducer;
