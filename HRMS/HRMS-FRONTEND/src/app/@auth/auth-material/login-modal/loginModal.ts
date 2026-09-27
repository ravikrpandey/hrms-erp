export class Login{
    constructor(
       public employee_official_email:string,
       public _token:string,
       public employee_photo:string,
       public first_name:string,
       public employee_id?:number,
       public role?:string,
       public role_id?:number,
    ){}
}