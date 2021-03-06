import {
    ViewChild, Renderer,
    Component, OnInit, ChangeDetectionStrategy,
    Injector, DoCheck, ViewEncapsulation,
    AfterViewInit
} from '@angular/core';

import code from '../shared/scaffolding-base';

// import {  } from '@angular/common';
import 'codemirror/mode/javascript/javascript';

/// <reference path='json5.d.ts' />
import * as json5 from 'json5';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, DoCheck, AfterViewInit {

    @ViewChild('a#jsonDownload')
    set downloadAnchor(v: HTMLAnchorElement) {
        console.log('%c step 4: downloadAnchor', 'color:red;font-size:medium;', arguments);
    }

    public code: string = code;
    public record: Object = {};
    public schema: Object = {};

    public cmOptions: Object = {};
    public jsonViewerOptions: Object = {};

    private codeJSON: Object = {};
    private codeJSONKeyList: Array<any> = [];
    private codeJSONUpdateTimeout: number = 0;

    constructor(private renderer: Renderer) {
        this.cmOptions = {
            lineNumbers: true,
            // mode: {
            //   name: 'javascript',
            //   json: true
            // },
            matchBrackets: true,
            autoCloseBrackets: true,
            mode: 'application/ld+json',
            lineWrapping: true
        };
        this.jsonViewerOptions = {};
        this.record = {};

    }

    get codeObject(): Object {
        if (this.codeJSON.hasOwnProperty('application')) {
            return this.codeJSON;
        }
        return this.codeJSON = json5.parse(this.code);
    }

    set codeObject(obj: Object) {
        this.codeJSON = obj;
        this.code = json5.stringify(obj);
        this.codeKeys = this.getKeyListfromObject(this.codeJSON, 1, '');
    }

    get codeKeys(): Array<any> {
        if (this.codeJSONKeyList.length > 0) {
            return this.codeJSONKeyList;
        }
        return this.codeJSONKeyList = this.getKeyListfromObject(this.codeObject, 1, '');
    }

    set codeKeys(arr: Array<any>) {
        this.codeJSONKeyList = arr;
    }

    getKeyListfromObject(obj: Object, span: number, path: string): Array<any> {
        let retArr = [];
        const spanArr = [];

        for (let k = 0; k < span; k++) {
            spanArr.push('');
        }

        for (const i in obj) {
            if (obj[i] instanceof Array) {
                retArr.push(spanArr.concat([i, '[', this.getObjectPath(path, i)]));
                retArr = retArr.concat(this.getObjectFromList(obj[i], span + 1, this.getObjectPath(path, i)));
                retArr.push(spanArr.concat([']']));
            } else if (obj[i] instanceof Object) {
                retArr.push(spanArr.concat([i, '{', this.getObjectPath(path, i)]));
                retArr = retArr.concat(this.getKeyListfromObject(obj[i], span + 1, this.getObjectPath(path, i)));
                retArr.push(spanArr.concat(['}']));
            } else {
                retArr.push(spanArr.concat([i, obj[i], this.getObjectPath(path, i)]));
            }
        }
        return retArr;
    }

    getObjectPath(currPath: string, i: any): string {
        let keyStr = '';

        if (typeof i === 'number') {
            keyStr = [currPath, '[', i, ']'].join('');
        } else {
            keyStr = [currPath, (currPath.length < 1 ? '' : '.'), i].join('');
        }
        return keyStr;
    }

    getObjectFromList(arr: Array<any>, span: number, path: string): Array<any> {
        let retArr = [];
        const spanArr = [];

        for (let k = 0; k < span; k++) {
            spanArr.push('');
        }

        arr.forEach((value, i) => {
            if (value instanceof Array) {
                retArr.push(spanArr.concat([i, '[', this.getObjectPath(path, i)]));
                retArr = retArr.concat(this.getObjectFromList(value, span + 1, this.getObjectPath(path, i)));
                retArr.push(spanArr.concat([']']));
                // retArr.push([i, [this.getObjectFromList(value)]]);
            } else if (value instanceof Object) {
                retArr.push(spanArr.concat([i, '{', this.getObjectPath(path, i)]));
                // console.log('key list from object', this.getKeyListfromObject(value));
                retArr = retArr.concat(this.getKeyListfromObject(value, span + 1, this.getObjectPath(path, i)));
                retArr.push(spanArr.concat(['}']));
                // retArr.push([i, this.getKeyListfromObject(value)]);
            } else {
                retArr.push(spanArr.concat([i, value, this.getObjectPath(path, i)]));
            }
        });

        return retArr;
    }

    isArray(arr: Array<any>): Boolean {
        return arr instanceof Array;
    }

    isPrimitive(item: Array<any>): Boolean {
        if (item.length > 2) {
            const value = item[item.length - 2];
            if (value === '{' || value === '[') {
                return false;
            }
        }
        return true;
    }

    isNotPrimitiveAndObjectEnd(item: Array<any>, itemIndex: number, isLast: boolean): Boolean {
        if (!isLast) {
            const i = itemIndex,
                nextItem: Array<any> = this.codeKeys[i + 1];

            console.log('%c item & nextItem length', 'color:red;font-size:20px;', item.length, nextItem.length, item, nextItem);
            if (item.length > nextItem.length) {
                return true;
            }
            return false;
        }
        return true;
    }

    isObjectKey(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log('is object key', [item, subitem, subitemIndex, item.length-3, item[subitemIndex+1]]);
        const c1: boolean = subitemIndex === item.length - 3;
        if (c1 && item[subitemIndex + 1] === '{') {
            return true;
        }
        return false;
    }

    isObjectBeginBrace(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log('is object key', [item, subitem, subitemIndex, item.length-2, item[subitemIndex]]);
        const c1: boolean = subitemIndex === item.length - 2;
        if (c1 && item[subitemIndex] === '{') {
            return true;
        }
        return false;
    }

    isObjectEndBrace(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log('is object key', [item, subitem, subitemIndex, item.length-2, item[subitemIndex]]);
        const c1: boolean = subitemIndex === item.length - 1;
        if (c1 && subitem === '}') {
            return true;
        }
        return false;
    }

    isArrayKey(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log('is array key', [item, subitem, subitemIndex, item.length-3, item[subitemIndex+1]]);
        const c1: boolean = subitemIndex === item.length - 3;
        if (c1 && item[subitemIndex + 1] === '[') {
            return true;
        }
        return false;
    }

    isArrayBeginBrace(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log('is array key', [item, subitem, subitemIndex, item.length-2, item[subitemIndex]]);
        const c1: boolean = subitemIndex === item.length - 2;
        if (c1 && item[subitemIndex] === '[') {
            return true;
        }
        return false;
    }

    isArrayEndBrace(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log('is object key', [item, subitem, subitemIndex, item.length-2, item[subitemIndex]]);
        const c1: boolean = subitemIndex === item.length - 1;
        if (c1 && subitem === ']') {
            return true;
        }
        return false;
    }

    isAttributeKey(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log('is attribute key', [item, subitem, subitemIndex, item.length-2, item[subitemIndex]]);
        const c1: boolean = subitemIndex === item.length - 3,
            isKey = (subitem.length > 0);
        if (c1 && isKey && !this.isArrayKey(item, subitem, subitemIndex) && !this.isObjectKey(item, subitem, subitemIndex)) {
            return true;
        }
        return false;
    }

    isAttributeValue(item: Array<any>, subitem: any, subitemIndex: number) {
        if (subitemIndex > 1) {
            // this.log('is attribute value', [item, subitem, subitemIndex, item[subitemIndex-1], subitemIndex-1]);
            return this.isAttributeKey(item, item[subitemIndex - 1], subitemIndex - 1);
        }
        return false;
    }

    isAttributeMetaValue(item: Array<any>, subitem: any, subitemIndex: number) {
        if (subitemIndex > 2) {
            // this.log('is attribute value', [item, subitem, subitemIndex, item[subitemIndex-1], subitemIndex-1]);
            return this.isAttributeKey(item, item[subitemIndex - 2], subitemIndex - 2);
        }
        return false;
    }

    getBeginBraces(item: Array<any>): Array<string> {
        const retArr = [],
            type = item[item.length - 2];
        for (let i = 0; i < item.length - 3; i++) {
            retArr.push('');
        }
        if (type === '{') {
            retArr.push('{');
        } else if (type === '[') {
            retArr.push('[');
        }
        return retArr;
    }

    getEndBraces(item: Array<any>): Array<string> {
        const retArr = [],
            type = item[item.length - 2];
        for (let i = 0; i < item.length - 3; i++) {
            retArr.push('');
        }
        if (type === '{') {
            retArr.push('}');
        } else if (type === '[') {
            retArr.push(']');
        }
        return retArr;
    }

    getOptions(item: Array<any>): Array<any> {
        const retArr = [],
            type = item[item.length - 1],
            name = item[item.length - 2];

        if (name === 'application' && type === '{') {
        }
        return retArr;
    }

    updateCodeJSON(keyPath: string, result: any) {
        Function('obj', 'value', `obj.` + keyPath + ` = value`)(this.codeJSON, result);
        this.codeObject = this.codeJSON;
        this.codeKeys = this.getKeyListfromObject(this.codeJSON, 1, '');
        this.log('result from dialog', [result, keyPath, this.codeJSON]);
    }

    handleAttributeValue(event: Event, keyPath: string) {
        const value = (event.target as HTMLInputElement).value;
        this.updateCodeJSON(keyPath, value);
    }

    /**
     * Application Object has default value for all its attributes
     * No methods needed right now.
     */
    isApplicationObject(item: Array<any>, subitem: any, subitemIndex: number): boolean {
        return false;
    }

    isPropertiesArray(item: Array<any>, subitem: any, subitemIndex: number): boolean {
        return (subitem === '[' && item[subitemIndex - 1] === 'properties') ? true : false;
    }

    isInputArray(item: Array<any>, subitem: any, subitemIndex: number): boolean {
        return (subitem === '[' && item[subitemIndex - 1] === 'input') ? true : false;
    }

    isOutputArray(item: Array<any>, subitem: any, subitemIndex: number): boolean {
        return (subitem === '[' && item[subitemIndex - 1] === 'output') ? true : false;
    }

    isMethodArray(item: Array<any>, subitem: any, subitemIndex: number): boolean {
        return (subitem === '[' && item[subitemIndex - 1] === 'methods') ? true : false;
    }

    isMethodParamArray(item: Array<any>, subitem: any, subitemIndex: number): boolean {
        return (subitem === '[' && item[subitemIndex - 1] === 'params') ? true : false;
    }

    isComponentArray(item: Array<any>, subitem: any, subitemIndex: number): boolean {
        return (subitem === '[' && item[subitemIndex - 1] === 'components') ? true : false;
    }

    addProperty(item: Array<any>, subitem: any, subitemIndex: number): void {
        const keyPath = item[subitemIndex + 1];
        const result = {
            name: 'newProperty',
            type: 'boolean',
            defaultValue: true
        };
        this.pushToCodeJSONArray(keyPath, result);
    }

    addInput(item: Array<any>, subitem: any, subitemIndex: number): void {
        const keyPath = item[subitemIndex + 1];
        const result = {
            name: 'newInput',
            // bindingType: 'property',
            parentBinding: 'parentProperty'
        };
        this.pushToCodeJSONArray(keyPath, result);
    }

    addOutput(item: Array<any>, subitem: any, subitemIndex: number): void {
        const keyPath = item[subitemIndex + 1];
        const result = {
            name: 'newOutput',
            // bindingType: 'property',
            parentBinding: 'parentMethod'
        };
        this.pushToCodeJSONArray(keyPath, result);
    }

    addMethod(item: Array<any>, subitem: any, subitemIndex: number): void {
        const keyPath = item[subitemIndex + 1];
        const result = {
            name: 'newMethod',
            params: [],
            return: {
                type: 'void'
            },
            getter: false,
            setter: false
        };
        this.pushToCodeJSONArray(keyPath, result);
    }

    addMethodParam(item: Array<any>, subitem: any, subitemIndex: number): void {
        const keyPath = item[subitemIndex + 1];
        const result = {
            name: 'newParam',
            type: 'string'
        };
        this.pushToCodeJSONArray(keyPath, result);
    }

    addComponent(item: Array<any>, subitem: any, subitemIndex: number): void {
        // Below code is not required as this condition check is done in the ngIf expression
        // if (subitem === '[' && item[subitemIndex-1] === 'components') {}
        // this.log('Arguments for Add Component', [item, subitem, subitemIndex]);
        const keyPath = item[subitemIndex + 1];
        const result = {
            name: 'newComponent',
            bindings: {
                input: [],
                output: []
            },
            properties: [],
            methods: [],
            components: []
        };
        this.pushToCodeJSONArray(keyPath, result);
    }

    isWithinArray(item: Array<any>, subitem: any, subitemIndex: number): boolean {
        // will test is the value is an number or not.
        // This will confirm whether the value is within an Array or not.
        const r: RegExp = /^\d+$/ig;
        return (subitem === '{' && r.test(item[subitemIndex - 1])) ? true : false;
    }

    prungeInstance(item: Array<any>, subitem: any, subitemIndex: number): void {
        const keyPath = item[subitemIndex + 1];
        const result = parseInt(item[subitemIndex - 1], 10);
        this.spliceFromCodeJSONArray(keyPath, result);
    }

    pushToCodeJSONArray(keyPath: string, result: any) {
        Function('obj', 'value', `obj.` + keyPath + `.push(value)`)(this.codeJSON, result);
        this.codeObject = this.codeJSON;
        this.codeKeys = this.getKeyListfromObject(this.codeJSON, 1, '');
    }

    spliceFromCodeJSONArray(keyPath: string, result: number) {
        Function('obj', 'value', `obj.` + keyPath.replace('[' + result + ']', '') + `.splice(value, 1)`)(this.codeJSON, result);
        this.codeObject = this.codeJSON;
        this.codeKeys = this.getKeyListfromObject(this.codeJSON, 1, '');
    }

    downloadLatestJSON(): void {
        console.log('%c step 3: Before Anchor click event triggered', 'color:red;font-size:medium;');
        const anchor: HTMLAnchorElement = this.renderer.selectRootElement('a#jsonDownload');
        const blob: Blob = new Blob([JSON.stringify(this.codeJSON)], { type: 'application/json' });
        const url: string = URL.createObjectURL(blob);
        anchor.href = url;
        anchor.click();
    }

    onRecordChange(record: Object) {
        this.record = record;
    }

    log(text: string, values: Array<any>) {
        console.log.apply(this, ['%c ' + text, 'color:red;font-size:20px;'].concat(values));
    }

    ngOnInit() {
        console.log('code object', this.codeObject);
        console.log('code object string', json5.stringify(this.codeObject));
    }

    ngDoCheck() {

    }

    ngAfterViewInit() {
        console.log('%c step 5: AfterViewInit', 'color:red;font-size:medium;', arguments);
    }

}
