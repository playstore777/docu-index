import { createReducer, on } from "@ngrx/store";
import {
  clearAdminData,
  clearSUAdminData,
  updateAdminData,
  updateSUAdminData,
} from "../actions/app.action";
import { AdminData } from "../models/admin.model";
import { SUAdminData } from "../models/su-admin.model";
import { AppState } from "../app.state";

// Define the initial state
export const initialState: AppState = {
  adminData: { currPage: 1, docId: 0, pdfSRC: "" },
  suAdminData: { currPage: 1, docId: 0, pdfSRC: "", fieldsList: [] },
};

// Define the reducer using createReducer and on from @ngrx/store
export const appReducer = createReducer(
  initialState,
  on(updateAdminData, (state, { adminData }) => {
    // Update the user object with the provided properties, keeping other properties unchanged
    const updatedAdminData: AdminData = { ...state.adminData, ...adminData };
    // console.log('updatedAdminData from appReducer(): ', state);
    return { ...state, adminData: updatedAdminData };
  }),
  on(updateSUAdminData, (state, { suAdminData }) => {
    // Update the user object with the provided properties, keeping other properties unchanged
    const updatedSUAdminData: SUAdminData = {
      ...state.suAdminData,
      ...suAdminData,
    };
    // console.log('updatedSUAdminData from appReducer(): ', updateSUAdminData);
    return { ...state, suAdminData: updatedSUAdminData };
  }),
  on(clearAdminData, (state) => {
    return initialState;
  }),
  on(clearSUAdminData, (state) => {
    return initialState;
  })
);
