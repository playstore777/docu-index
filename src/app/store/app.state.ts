import { AdminData } from "./models/admin.model";
import { SUAdminData } from "./models/su-admin.model";

export interface AppState {
    adminData: AdminData;
    suAdminData: SUAdminData;
}
