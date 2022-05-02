import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'abbreviation'
})

export class AbbreviationUserPipe implements PipeTransform {
    constructor() { }

    transform(user: any) {
        let pos;
        if (user && user.departments?.length > 0) {
            pos = user.departments.reduce((position, department, index) => position + (index > 0 ? '/' : '') + department.position.abbreviationName, '');
        }
        if (user && user.userDeparments?.length > 0) {
            pos = user.userDeparments.reduce((position, department, index) => position + (index > 0 ? '/' : '') + department.positionAbbreviationName, '');
        }
        if (user && user.authorDeparments?.length > 0) {
            pos = user.authorDeparments.reduce((position, department, index) => position + (index > 0 ? '/' : '') + department.positionAbbreviationName, '');
        }
        let arr = user?.fullName?.split(' ');
        
        if (!arr) return;

        let abbreviation = '';
        let l = arr.length
        if (l > 1) {
            for (let i = 0; i < l - 1; i++) {
                abbreviation += this.capitalizeFirstLetter(arr[i])
            }
            abbreviation += this.stringToSlug(arr[l - 1]);
        } else abbreviation = this.stringToSlug(user.fullName);
        if (pos) abbreviation += "_" + pos;
        if (user.userState === 3 || user.deleteFlag === 1) abbreviation += '[DEL]'
        return abbreviation
    }

    
    public capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase();
    }

    public stringToSlug(str) {
        // remove accents
        var from = "ÂÁẨàáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
            to = "aaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(RegExp(from[i], "gi"), to[i]);
        }

        str = str
            .trim()
            .replace(/-+/g, '-');

        return str;
    }

}