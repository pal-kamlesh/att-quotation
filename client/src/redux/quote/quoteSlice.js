import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  quotations: [],
  totalQuotations: "",
  todayQuotations: "",
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
export const createQuote = createAsyncThunk(
  "create/Quote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/quotation/create", {
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
export const showMoreQuotes = createAsyncThunk(
  "showMore/quotes",
  async ({ startIndex, extraQuery = "" }, { rejectWithValue }) => {
    try {
      let url = `/api/v1/quotation/getQuotes?startIndex=${startIndex}`;
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
export const getQuotes = createAsyncThunk(
  "get/quotes",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/quotation/getQuotes?${data}`);
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
export const getSingleQuote = createAsyncThunk(
  "get/singleQuote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/quotation/${data}`);
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
  "approve/singleQuote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/quotation/approve/${data}`);
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

export const searchQuotes = createAsyncThunk(
  "search/quotes",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/quotation/getQuotes?${data}`);
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
  "get/docxdata",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/quotation/docx/${data}`);
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

export const updateQuote = createAsyncThunk(
  "update/quote",
  async (data, { rejectWithValue }) => {
    const { id, quote } = data;
    try {
      const response = await fetch(`/api/v1/quotation/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quote),
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

export const quoteSlice = createSlice({
  name: "quote",
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
      .addCase(createQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuote.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.quotations.push(payload.result);
        state.quotations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        state.todayQuotations = state.todayQuotations + 1;
        state.totalQuotations = state.totalQuotations + 1;
        toast.success(payload.message);
      })
      .addCase(createQuote.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      })
      .addCase(showMoreQuotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(showMoreQuotes.fulfilled, (state, { payload }) => {
        const newData = [...state.quotations, ...payload.result];
        state.loading = false;
        state.quotations = newData;
        if (payload.result.length < 9) {
          state.showMore = false;
        } else {
          state.showMore = true;
        }
      })
      .addCase(showMoreQuotes.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })

      .addCase(searchQuotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchQuotes.fulfilled, (state, { payload }) => {
        state.quotations = payload.result;
        state.loading = false;
        state.todayQuotations = payload.todayQuotes;
        state.totalQuotations = payload.totalQuotes;
        if (payload.result.length < 9) {
          state.showMore = false;
        } else {
          state.showMore = true;
        }
      })
      .addCase(searchQuotes.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(getQuotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuotes.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.quotations = payload.result;
        state.todayQuotations = payload.todayQuotes;
        state.totalQuotations = payload.totalQuotes;
        if (payload.result.length < 9) {
          state.showMore = false;
        } else {
          state.showMore = true;
        }
      })
      .addCase(getQuotes.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(getSingleQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleQuote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getSingleQuote.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload);
      })
      .addCase(approve.pending, (state) => {
        state.loading = true;
      })
      .addCase(approve.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.quotations = state.quotations.filter(
          (quote) => quote._id !== payload.result._id
        );
        state.quotations.push(payload.result);
        state.quotations.sort(
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
      .addCase(updateQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuote.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.quotations = state.quotations.filter(
          (quote) => quote._id !== payload.result._id
        );
        state.quotations.push(payload.result);
        state.quotations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        state.todayQuotations = state.todayQuotations + 1;
        state.totalQuotations = state.totalQuotations + 1;
        toast.success(payload.message);
      })
      .addCase(updateQuote.rejected, (state, { payload }) => {
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
} = quoteSlice.actions;

export default quoteSlice.reducer;
