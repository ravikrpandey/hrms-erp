import { FinaceService } from "../../services/finace.service";

export class CheckPostingPeriod {
    constructor(private _finaceservice: FinaceService) { }

    returnActiveMonth(entity_id: any, financial_id: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._finaceservice.getFinancialYearActiveMonthByEntityId(entity_id, financial_id).subscribe({
                next: (res: any) => {
                    let newMonth = this._finaceservice.getCurrentMonth();
                    let isExistData = res.data.some((x: any) => x.month === newMonth);
                    resolve(isExistData); 
                },
                error: (err) => {
                    console.log(err);
                    reject(false);  
                }
            });
        });
    }
}
