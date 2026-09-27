export enum ActiveStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum NameTitle {
  MR = 'Mr',
  MRS = 'Mrs',
  MISS = 'Miss',
  DR = 'Dr',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed',
}

export interface APIResponse<T> {
  code?: number;
  message: string;
  data?: T;
}

export interface RbacModule {
  id: number;
  path: string;
  icon: string;
  lastIcon: string;
  name: string;
  title: string;
  status: boolean;
  order: number;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  children?: RbacModule[];
  selected?: boolean;
  read?: boolean;
  write?: boolean;
  remove?: boolean;
  isUser?: boolean; // Flag to indicate if permission is user-specific
  expanded?: boolean; // Flag to control expansion panel state
  isActive?: boolean;
}

export interface Attendance {
  employee_id: string;
  punching_date: string;
  punching_time: string;
  punching_status: 'OUT';
}

export interface ModuleAction {
  Read?: boolean;
  Write?: boolean;
  Delete?: boolean;
}

export interface ModuleAccess {
  moduleId: number;
  moduleName: string;
  modulePath: string;
  read: boolean;
  write: boolean;
  remove: boolean;
  hasAccess: boolean;
  isUserOverride: boolean;
}

export interface AccessData {
  accessMap: { [moduleId: number]: ModuleAccess };
  modules: RbacModule[];
  summary: {
    totalModules: number;
    accessibleCount: number;
    userOverrides: number;
  };
}

export interface UserData {
  employee_official_email: string;
  title: string;
  employee_photo: string;
  first_name: string;
  last_name: string;
  contact_number: string;
  createdAt: string;
  employee_id: number;
  role_master_id: number;
  accessToken: string;
  primary_entity_id: number;
  department_id: number;
  department_name: string;
  employee_code: string;
  entityList: EntityList[];
  financeList: FinanceList[];
  hasAccess: boolean;
  organization_id?: number;
  organization?: Organization;
}

export interface EntityList {
  entity_id: number;
  entity_name: string;
  logo: string;
}

export interface FinanceList {
  id: number;
  financial_year: string;
  entity_id: number
}

export interface UserContext {
  financialId: number;
  employeeId: number;
  roleId: number;
  entityId: number;
}

export interface Organization {
  id: number;
  name: string;
  address: string;
}

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
}