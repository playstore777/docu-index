import { createAction, props } from "@ngrx/store";
import { AdminData } from "../models/admin.model";
import { SUAdminData } from "../models/su-admin.model";
import { Observable } from "rxjs";

// Define actions using createAction and props from @ngrx/store
export const updateAdminData = createAction(
  "[AdminData] Update Admin Data",
  props<{ adminData: Partial<AdminData> }>()
);

export const updateSUAdminData = createAction(
  "[SUAdminData] Update SU Admin Data",
  props<{ suAdminData: Partial<SUAdminData> }>()
);

export const clearAdminData = createAction("[AdminData] Clear Admin Data");

export const clearSUAdminData = createAction(
  "[SUAdminData] Clear SUAdmin Data"
);

export const addAnalysisMasterData = createAction(
  "[AnalysisMasterData] Add Analysis Master data",
  props<{ analysisMasterData: Observable<any> }>()
);

export const updateAnalysisList = createAction(
  "[AnalysisData] Update Analysis table data",
  props<{ analysisDataList: Observable<any> }>()
);

export const addReportsList = createAction(
  "[ReportsData] Update Reports table data",
  props<{ reportsDataList: Observable<any> }>()
);

export const addReportDocData = createAction(
  "[ReportDocData] Update Report Doc Data table data",
  props<{ reportDocData: any }>()
);
