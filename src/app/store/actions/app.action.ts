import { createAction, props } from "@ngrx/store";
import { AdminData } from "../models/admin.model";
import { SUAdminData } from "../models/su-admin.model";

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
