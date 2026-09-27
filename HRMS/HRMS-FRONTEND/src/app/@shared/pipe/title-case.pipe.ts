import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "titleCase" })
export class TitleCasePipe implements PipeTransform {
  public transform(input: string): string {
    
    if (!input) {
      return "";
    } else {
      return input.replace(
        /\b((?!=|\,|\.).)+(.)\b/g,
        first => first.substr(0, 1).toUpperCase() + first.substr(1)
      );
    }
  }
}
