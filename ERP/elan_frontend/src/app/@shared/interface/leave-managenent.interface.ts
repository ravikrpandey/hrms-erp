import {ActiveStatus, APIResponse, Gender, MaritalStatus, NameTitle} from "./core.interface";

// Enum Definitions
export enum LeaveType {
    PAID = 'PAID',
    NON_PAID = 'NON PAID'
}

export enum PolicyValidity {
    CHECKED = '1',
    UNCHECKED = '0'
}

export enum EffectivePeriod {
    YEAR = 'YEAR',
    MONTHS = 'MONTHS',
    DAYS = 'DAYS'
}

export enum FromDateType {
    DOJ = 'DOJ',  // Date of Joining
    DOC = 'DOC'   // Date of Confirmation
}

export enum CalculationMode {
    UNIT = 'UNIT',
    PERCENT = 'PERCENT'
}

export interface HRMSLeaveMaster {
    id: number;
    leave_name: string;
    leave_code: string;
    total_available: number;
    status: ActiveStatus;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    financial_year_id?: number;
    entity_id?: number;
    employee_id?: number;
    total_leave_applied?: string;
    total_approved_days?: string;
    remaining_leave?: number;
}

export interface HRMSLeavePolicyDetail {
    id: number;
    leave_type: LeaveType;
    startDate: string | null; // Format: "YYYY-MM-DD"
    endDate: string | null;   // Format: "YYYY-MM-DD"
    policy_validity: PolicyValidity;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    HRMS_LEAVE_MASTER?: HRMSLeaveMaster;
}

export interface HRMSLeavePolicyEntitlement {
    id: number;
    isDeleted: boolean;

    /** Value as string (e.g., "15") */
    effective_value: string;

    /** Period for entitlement calculation */
    effective_period: EffectivePeriod;

    /** Duration in the specified period (nullable) */
    effective_duration: number | null;

    /** Base date for calculation */
    from: FromDateType;

    /** Number of leaves that can be carried forward */
    carry_unused_leaves: number | null;

    /** Mode for calculating unused leaves */
    unused_leaves_mode: CalculationMode;

    /** Maximum limit for carry forward */
    carry_unused_limit: number | null;

    /** Number of leaves eligible for encashment */
    encash_leaves: number | null;

    /** Mode for encashment calculation */
    encash_mode: CalculationMode;

    /** Maximum encashment limit */
    encash_limit: number | null;

    // Automatic timestamps
    createdAt?: Date;
    updatedAt?: Date;
}

export interface HRMSLeavePolicyRestrictions {
    id: number;

    /** Soft delete flag */
    isDeleted: boolean;

    /** Maximum days in past leave can be applied for */
    past_days: number;

    /** Maximum days in future for immediate leave requests */
    future_next: number;

    /** Maximum advance notice required for planned leaves (in days) */
    future_advanceDays: number;

    /** Maximum number of leaves that can be requested at once */
    maxRequest: number;

    /** Minimum number of leaves per request */
    minRequest: number;

    // Automatic timestamps
    createdAt?: Date;
    updatedAt?: Date;
    durations?: LeaveRestrictionDuration[];
}

export interface AllLeaveInterface extends HRMSLeaveMaster {
    total_leave_applied: string;
    total_approved_days: string;
    remaining_leave: number;
}

export interface AllLeavesByDepartmentResponse extends APIResponse<AllLeaveInterface[]> {
}

export interface EmployeeForLeave {
    employee_id: number;
    title: NameTitle;
    employee_code: string;
    first_name: string;
    last_name: string;
    department_id: number;
    location_id: number;
    role_master_id: number;
    marital_status: MaritalStatus;
    gender: Gender;
    designation_id: number;
}

export interface EmployeeForLeaveResponse extends APIResponse<EmployeeForLeave[]> {
}

export interface LeaveRestrictionDuration {
    id: number;
    duration: string;
    status: ActiveStatus;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    leaveId: number;
}

export interface LeaveRestrictionsByIdResponse extends APIResponse<HRMSLeavePolicyRestrictions> {
}

export interface EffectiveAppliedLeaveResponse extends APIResponse<HRMSLeaveMaster> {
    flag: boolean;
}

export interface LeavePolicyByIdResponse extends APIResponse<HRMSLeavePolicyDetail[]> {

}