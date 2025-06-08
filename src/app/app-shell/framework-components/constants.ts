import { UUID } from "angular2-uuid"
import * as moment from "jalali-moment";
import { FormGroup } from "@angular/forms";
declare var $: any;

export const noImagePath = "../../../../../assets/images/noimage.png";

export var sessions = [
    { id: 1, name: "بهار", miladi: 'Spring' },
    { id: 2, name: "تابستان", miladi: 'Summer' },
    { id: 3, name: "پاییز", miladi: 'Autumn' },
    { id: 4, name: "زمستان", miladi: 'Winter' }
]

export const years = [
    { id: 1402, name: 1402 },
    { id: 1403, name: 1403 },
    { id: 1404, name: 1404 }
]

export var months = [
    { id: 1, name: "فروردین", miladi: 'January' },
    { id: 2, name: "اردیبهشت", miladi: 'February' },
    { id: 3, name: "خرداد", miladi: 'March' },
    { id: 4, name: "تیر", miladi: 'April' },
    { id: 5, name: "مرداد", miladi: 'May' },
    { id: 6, name: "شهریور", miladi: 'June' },
    { id: 7, name: "مهر", miladi: 'July' },
    { id: 8, name: "آبان", miladi: 'August' },
    { id: 9, name: "آذر", miladi: 'September' },
    { id: 10, name: "دی", miladi: 'October' },
    { id: 11, name: "بهمن", miladi: 'November' },
    { id: 12, name: "اسفند", miladi: 'December' }
]

export var daysOfMonth = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
    { id: 7, name: "7" },
    { id: 8, name: "8" },
    { id: 9, name: "9" },
    { id: 10, name: "10" },
    { id: 11, name: "11" },
    { id: 12, name: "12" },
    { id: 13, name: "13" },
    { id: 14, name: "14" },
    { id: 15, name: "15" },
    { id: 16, name: "16" },
    { id: 17, name: "17" },
    { id: 18, name: "18" },
    { id: 19, name: "19" },
    { id: 20, name: "20" },
    { id: 21, name: "21" },
    { id: 22, name: "22" },
    { id: 23, name: "23" },
    { id: 24, name: "24" },
    { id: 25, name: "25" },
    { id: 26, name: "26" },
    { id: 27, name: "27" },
    { id: 28, name: "28" },
    { id: 29, name: "29" },
    { id: 30, name: "30" },
    { id: 31, name: "31" }
]

export var weeks = [
    { id: 0, name: "0" },
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
    { id: 7, name: "7" },
    { id: 8, name: "8" },
    { id: 9, name: "9" },
    { id: 10, name: "10" },
    { id: 11, name: "11" },
    { id: 12, name: "12" },
    { id: 13, name: "13" },
    { id: 14, name: "14" },
    { id: 15, name: "15" },
    { id: 16, name: "16" },
    { id: 17, name: "17" },
    { id: 18, name: "18" },
    { id: 19, name: "19" },
    { id: 20, name: "20" },
    { id: 21, name: "21" },
    { id: 22, name: "22" },
    { id: 23, name: "23" },
    { id: 24, name: "24" },
    { id: 25, name: "25" },
    { id: 26, name: "26" },
    { id: 27, name: "27" },
    { id: 28, name: "28" },
    { id: 29, name: "29" },
    { id: 30, name: "30" },
    { id: 31, name: "31" },
    { id: 32, name: "32" },
    { id: 33, name: "33" },
    { id: 34, name: "34" },
    { id: 35, name: "35" },
    { id: 36, name: "36" },
    { id: 37, name: "37" },
    { id: 38, name: "38" },
    { id: 39, name: "39" },
    { id: 40, name: "40" },
    { id: 41, name: "41" },
    { id: 42, name: "42" },
    { id: 43, name: "43" },
    { id: 44, name: "44" },
    { id: 45, name: "45" },
    { id: 46, name: "46" },
    { id: 47, name: "47" },
    { id: 48, name: "48" },
    { id: 49, name: "49" },
    { id: 50, name: "50" },
    { id: 51, name: "51" },
    { id: 52, name: "52" },
]

export var welcomeImages = [
    { id: '6' },
    { id: '7' },
]

export var daysOfWeek = [
    { id: 1, name: "شنبه" },
    { id: 2, name: "یکشنبه" },
    { id: 3, name: "دوشنبه" },
    { id: 4, name: "سه شنبه" },
    { id: 5, name: "چهار شنبه" },
    { id: 6, name: "پنج شنبه" },
    { id: 7, name: "جمعه" },
]

export function getCurrentMonth(calendarType = 1) {
    const date = new Date();
    const mom = moment(date);
    let month = mom.jMonth();

    if (calendarType == 2) {
        month = mom.month();
    }

    return months[month].id;
}

export function getCurrentYear(calendarType = 1) {
    const date = new Date();
    const mom = moment(date);
    let year = mom.jYear();

    if (calendarType == 2) {
        year = mom.year();
    }

    return years.find(x => x.id == year).name
}

export var datePickerConfig = {
    drops: 'down',
    format: 'jYYYY/jMM/jDD',
    theme: "dp-material"
}

function p8(s = false) {
    var p = (Math.random().toString(16) + "000000000").substring(2, 8);
    return s ? "-" + p.substring(0, 4) + "-" + p.substring(4, 4) : p;
}

export function createGuid() {
    // return p8() + p8(true) + p8(true) + p8();
    // return crypto.randomUUID()
    return UUID.UUID()
}

export var HotkeysAllowedIn = ['INPUT', 'TEXTAREA', 'SELECT'];

export function createPreSelectedOption(selectId: string, dataName: string, dataId: string) {
    if (!dataName) return;

    let select = $(selectId);
    let option = new Option(dataName, dataId, true, true);
    select.append(option).trigger('change');
}

export function colorizeRow(index, prefix = 'item') {
    $(`[id^="${prefix}-"]`).each(function (_index, item) {
        $(item).removeClass("bg-soft-primary");
    });

    $(`#${prefix}-${index}`).addClass("bg-soft-primary");
}

export function getTodayDate() {
    return moment().locale('fa').format('jYYYY/jMM/jDD');
}

export function GetCurrentYear() {

}

export function toMoney(value) {
    return new Intl.NumberFormat().format(value);
}

export function formGroupToFormData(formGroup: FormGroup) {
    const formData = new FormData()
    console.log(formGroup);

    for (let key in formGroup.controls) {
        formData.append(key, formGroup.controls[key].value)
    }

    return formData
}

export function jsonToFormData(jsonObject: Object) {
    const formData = new FormData()

    for (let key in jsonObject) {
        console.log(jsonObject[key])
        if (jsonObject[key] instanceof Array) {
            this.formgrouptoformdata(formData, jsonObject[key] as Object);
        }
        else {
            formData.append(key, jsonObject[key]);
        }
    }
}

export function convertJsontoFormData(jsonObject: Object, parentKey, carryFormData: FormData): FormData {

    const formData = carryFormData || new FormData();
    let index = 0;

    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
                var propName = parentKey || key;
                if (parentKey && this.isObject(jsonObject)) {
                    propName = parentKey + '[' + key + ']';
                }
                if (parentKey && this.isArray(jsonObject)) {
                    propName = parentKey + '[' + index + ']';
                }
                if (jsonObject[key] instanceof File) {
                    formData.append(propName, jsonObject[key]);
                } else if (jsonObject[key] instanceof FileList) {
                    for (var j = 0; j < jsonObject[key].length; j++) {
                        formData.append(propName + '[' + j + ']', jsonObject[key].item(j));
                    }
                } else if (this.isArray(jsonObject[key]) || this.isObject(jsonObject[key])) {
                    this.convertJsontoFormData(jsonObject[key], propName, formData);
                } else if (typeof jsonObject[key] === 'boolean') {
                    formData.append(propName, +jsonObject[key] ? '1' : '0');
                } else {
                    formData.append(propName, jsonObject[key]);
                }
            }
        }
        index++;
    }
    return formData;
}
function isArray(val) {
    const toString = ({}).toString;
    return toString.call(val) === '[object Array]';
}

function isObject(val) {
    return !this.isArray(val) && typeof val === 'object' && !!val;
}

export var activityTypes = [
    { guid: 1, title: "فعالیت" },
    { guid: 2, title: "توقف" }
]

export var activitySubTypes = [
    { guid: 1, title: 'جوشکاری', type: 1 },
    { guid: 2, title: 'غیر جوشکاری', type: 1 },
    { guid: 3, title: 'تولیدی', type: 2 },
    { guid: 4, title: 'غیر تولیدی', type: 2 },
    { guid: 5, title: 'تولید سیم', type: 1 },
    { guid: 6, title: 'بسته بندی سیم', type: 1 },
    { guid: 7, title: 'خدمات فنی', type: 1 },
]
