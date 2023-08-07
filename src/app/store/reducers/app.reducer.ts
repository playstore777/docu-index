import { createReducer, on } from "@ngrx/store";
import {
  addAnalysisMasterData,
  addReportDocData,
  addReportsList,
  clearAdminData,
  clearSUAdminData,
  updateAdminData,
  updateAnalysisFilteredList,
  updateAnalysisList,
  updateSUAdminData,
} from "../actions/app.action";
import { AdminData } from "../models/admin.model";
import { SUAdminData } from "../models/su-admin.model";
import { AppState } from "../app.state";
import { of } from "rxjs";

// Define the initial state
export const initialState: AppState = {
  adminData: { currPage: 1, docId: 0, pdfSRC: "" },
  suAdminData: { currPage: 1, docId: 0, pdfSRC: "", fieldsList: [] },
  analysisDataList: of([]),
  analysisFilteredDataList: of([]),
};

// Define the reducer using createReducer and on from @ngrx/store
export const appReducer = createReducer(
  initialState,
  on(updateAdminData, (state, { adminData }) => {
    // Update the user object with the provided properties, keeping other properties unchanged
    const updatedAdminData: AdminData = { ...state.adminData, ...adminData };
    return { ...state, adminData: updatedAdminData };
  }),
  on(updateSUAdminData, (state, { suAdminData }) => {
    // Update the user object with the provided properties, keeping other properties unchanged
    const updatedSUAdminData: SUAdminData = {
      ...state.suAdminData,
      ...suAdminData,
    };
    return { ...state, suAdminData: updatedSUAdminData };
  }),
  on(clearAdminData, (state) => {
    return initialState;
  }),
  on(clearSUAdminData, (state) => {
    return initialState;
  }),
  on(addAnalysisMasterData, (state, { analysisMasterData }) => {
    return { ...state, analysisMasterData };
  }),
  on(updateAnalysisList, (state, { analysisDataList }) => {
    return { ...state, analysisDataList };
  }),
  on(updateAnalysisFilteredList, (state, { analysisFilteredDataList }) => {
    return { ...state, analysisFilteredDataList };
  }),
  on(addReportsList, (state, { reportsDataList }) => {
    return { ...state, reportsDataList };
  }),
  on(addReportDocData, (state, { reportDocData }) => {
    return { ...state, reportDocData };
  })
);
