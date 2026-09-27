import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myExpence'
})
export class MyExpencePipe implements PipeTransform {

//   transform(value: any, searchExpense:any) {
  
//     
//     

//   // return value.filter(function(search:any)
//   // {
//   //   return search.fullName.toLowerCase().indexOf(searchTerm) > -1
//   // })
//   // }

//   let nameAuther = value.filter(function(search:any)
  
//   {
//   
// let numberExpense=(search.expense_report_no);
// 

//     return search.expense_desc.toLowerCase().indexOf(searchExpense.toLowerCase()) > -1
//   })
//   
  
//   return nameAuther

//   }

  // transform(value: any, searchExpense:any) {
  //   
  //   
  
  // return value.filter(function(search:any){
  //   return search.expense_report_no.toLowerCase().indexOf(searchExpense) > -1
  // })
  // }

  transform(data: any[], args: any) {

    if (!data) return null;
    if (!args) return data;
    args = args.toLowerCase();

    return data.filter((item: any) => {
      return JSON.stringify(item).toLowerCase().includes(args);
    });

  }
  
}
