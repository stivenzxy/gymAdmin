import { Pipe, PipeTransform, EventEmitter, Output } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  @Output() searchResult = new EventEmitter<boolean>();

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) {
      this.searchResult.emit(true);
      return value; // si no hay valor de busqueda, retornamos los datos
    }

    args = args.toLowerCase();
    let result = value.filter((item: any) => {
      return JSON.stringify(item).toLowerCase().includes(args);
    });

    this.searchResult.emit(result.length > 0);
    return result;
  }
}
