import { 
    Component, OnInit, ChangeDetectionStrategy, 
    Injector, DoCheck } from '@angular/core';
import {MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';

import { DialogContentComponent } from '../shared/dialog-content/dialog-content.component';

// import {  } from '@angular/common';
import 'codemirror/mode/javascript/javascript';

/// <reference path="json5.d.ts" />
import * as json5 from 'json5';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnInit, DoCheck {

    public code: string = `{
        /*
            Application object is the root object that defines to the UI Application.
            All the components, its uni-directional bindings and hierachial structure forms the whole application. 
        */
        "application": {
            name: "website",
            bootstrap: true,
            /*
                Component object is the just another component definition which holds rest of the components
                a component holds bindings which dictates the input and output of it.
                a component holds properties & methods which can be mere placeholder or can be for the binding above.
                a component holds child components. 
            */
            rootComponent: {
                name: "viewport",
                bindings: {
                    input: [
                    ],
                    output: [
                    ]
                },
                properties: [
                    {
                        name: "enableSideBar",
                        type: "boolean",
                        defaultValue: true
                    }, {
                        name: "miniFooter",
                        type: "boolean",
                        defaultValue: true
                    }, {
                        name: "minHeader",
                        type: "boolean",
                        defaultValue: false
                    }
                ],
                methods: [
                    {
                        name: "headerCallback",
                        params: [],
                        return: {
                            type: "void"
                        },
                        getter: false,
                        setter: false
                    }
                ],
                components: [
                ]
            },
            bindings: {
                input: [
                ],
                output: [
                ]
            }
        }
    }`;
    public record: Object = {};
    public schema: Object = {};

    public cmOptions: Object = {};
    public jsonViewerOptions: Object = {};

    private codeJSON:Object = {};
    private codeJSONKeyList:Array<any> = [];

    constructor(private _dialog: MdDialog) {
        this.cmOptions = {
            lineNumbers: true,
            // mode: {
            //   name: 'javascript',
            //   json: true
            // },
            matchBrackets: true,
            autoCloseBrackets: true,
            mode: "application/ld+json",
            lineWrapping: true
        };
        this.jsonViewerOptions = {};
        this.record = {};

    }

    get codeObject(): Object {
        if(this.codeJSON.hasOwnProperty('application')) {
            return this.codeJSON;
        }
        return this.codeJSON = json5.parse(this.code);
    }

    set codeObject(obj: Object) {
        this.codeJSON = obj;
        this.code = json5.stringify(obj);
        this.codeKeys = this.getKeyListfromObject(this.codeJSON, 1, "");
    }

    get codeKeys(): Array<any> {
        if(this.codeJSONKeyList.length > 0) {
            return this.codeJSONKeyList;
        }
        return this.codeJSONKeyList = this.getKeyListfromObject(this.codeObject, 1, "");
    }

    set codeKeys(arr:Array<any>) {
        this.codeJSONKeyList = arr;
    }

    getKeyListfromObject(obj: Object, span: number, path: string): Array<any> {
        let retArr = [],
            spanArr = [];

        for (var k = 0; k < span; k++) {
            spanArr.push("");
        }

        for (let i in obj) {
            if (obj[i] instanceof Array) {
                retArr.push(spanArr.concat([i, "[", this.getObjectPath(path, i)]));
                retArr = retArr.concat(this.getObjectFromList(obj[i], span + 1, this.getObjectPath(path, i)));
                retArr.push(spanArr.concat(["]"]));
            } else if (obj[i] instanceof Object) {
                retArr.push(spanArr.concat([i, "{", this.getObjectPath(path, i)]));
                retArr = retArr.concat(this.getKeyListfromObject(obj[i], span + 1, this.getObjectPath(path, i)));
                retArr.push(spanArr.concat(["}"]));
            } else {
                retArr.push(spanArr.concat([i, obj[i], this.getObjectPath(path, i)]));
            }
        }
        return retArr;
    }

    getObjectPath(currPath: string, i: any): string {
        let retStr = "",
            keyStr = "";

        if (typeof i == "number") {
            keyStr = [currPath, "[", i, "]"].join("");
        } else {
            keyStr = [currPath, (currPath.length < 1 ? "" : "."), i].join("");
        }

        // if(currPath.length < 1) {
        //     retStr = keyStr;
        // } else {
        //     retStr = [currPath, keyStr].join("");
        // }
        return keyStr;
    }

    getObjectFromList(arr: Array<any>, span: number, path: string): Array<any> {
        let retArr = [],
            spanArr = [];

        for (var k = 0; k < span; k++) {
            spanArr.push("");
        }

        arr.forEach((value, i) => {
            if (value instanceof Array) {
                retArr.push(spanArr.concat([i, "[", this.getObjectPath(path, i)]));
                retArr = retArr.concat(this.getObjectFromList(value, span + 1, this.getObjectPath(path, i)));
                retArr.push(spanArr.concat(["]"]));
                // retArr.push([i, [this.getObjectFromList(value)]]);
            } else if (value instanceof Object) {
                retArr.push(spanArr.concat([i, "{", this.getObjectPath(path, i)]));
                // console.log("key list from object", this.getKeyListfromObject(value));
                retArr = retArr.concat(this.getKeyListfromObject(value, span + 1, this.getObjectPath(path, i)));
                retArr.push(spanArr.concat(["}"]));
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
            let value = item[item.length - 2];
            if (value == "{" || value == "[") {
                return false;
            }
        }
        return true;
    }

    isNotPrimitiveAndObjectEnd(item: Array<any>, itemIndex: number, isLast: boolean): Boolean {
        if (!isLast) {
            let i = itemIndex,
                nextItem: Array<any> = this.codeKeys[i + 1];

            console.log("%c item & nextItem length", "color:red;font-size:20px;", item.length, nextItem.length, item, nextItem);

            if (item.length > nextItem.length) {
                return true;
            }
            return false;
        }
        return true;
    }

    isObjectKey(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log("is object key", [item, subitem, subitemIndex, item.length-3, item[subitemIndex+1]]);
        let c1: boolean = subitemIndex == item.length - 3;
        if (c1 && item[subitemIndex + 1] == "{") {
            return true;
        }
        return false;
    }

    isObjectBeginBrace(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log("is object key", [item, subitem, subitemIndex, item.length-2, item[subitemIndex]]);
        let c1: boolean = subitemIndex == item.length - 2;
        if (c1 && item[subitemIndex] == "{") {
            return true;
        }
        return false;
    }

    isArrayKey(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log("is array key", [item, subitem, subitemIndex, item.length-3, item[subitemIndex+1]]);
        let c1: boolean = subitemIndex == item.length - 3;
        if (c1 && item[subitemIndex + 1] == "[") {
            return true;
        }
        return false;
    }

    isArrayBeginBrace(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log("is array key", [item, subitem, subitemIndex, item.length-2, item[subitemIndex]]);
        let c1: boolean = subitemIndex == item.length - 2;
        if (c1 && item[subitemIndex] == "[") {
            return true;
        }
        return false;
    }

    isAttributeKey(item: Array<any>, subitem: any, subitemIndex: number) {
        // this.log("is attribute key", [item, subitem, subitemIndex, item.length-2, item[subitemIndex]]);
        let c1: boolean = subitemIndex == item.length - 3,
            isKey = (subitem.length > 0);
        if (c1 && isKey && !this.isArrayKey(item, subitem, subitemIndex) && !this.isObjectKey(item, subitem, subitemIndex)) {
            return true;
        }
        return false;
    }

    isAttributeValue(item: Array<any>, subitem: any, subitemIndex: number) {
        if (subitemIndex > 1) {
            // this.log("is attribute value", [item, subitem, subitemIndex, item[subitemIndex-1], subitemIndex-1]);
            return this.isAttributeKey(item, item[subitemIndex - 1], subitemIndex - 1);
        }
        return false;
    }

    isAttributeMetaValue(item: Array<any>, subitem: any, subitemIndex: number) {
        if (subitemIndex > 2) {
            // this.log("is attribute value", [item, subitem, subitemIndex, item[subitemIndex-1], subitemIndex-1]);
            return this.isAttributeKey(item, item[subitemIndex - 2], subitemIndex - 2);
        }
        return false;
    }

    getBeginBraces(item: Array<any>): Array<string> {
        let retArr = [],
            type = item[item.length - 2];
        for (var i = 0; i < item.length - 3; i++) {
            retArr.push("");
        }
        if (type == "{") {
            retArr.push("{");
        } else if (type == "[") {
            retArr.push("[");
        }
        return retArr;
    }

    getEndBraces(item: Array<any>): Array<string> {
        let retArr = [],
            type = item[item.length - 2];
        for (var i = 0; i < item.length - 3; i++) {
            retArr.push("");
        }
        if (type == "{") {
            retArr.push("}");
        } else if (type == "[") {
            retArr.push("]");
        }
        return retArr;
    }

    getOptions(item: Array<any>): Array<any> {
        var retArr = [],
            type = item[item.length - 1],
            name = item[item.length - 2];

        if (name == "application" && type == "{") {

        }

        return retArr;
    }

    handleAttributeValue() {
        let arr: Array<any> = [];
        for (var key in arguments) {
            arr.push(arguments[key]);
        }
        this.log("attribute value", arr);
    }


    openDialog(keyPath: string, key:string, value: string) {
        this.log("triggered", []);

        // var dc:DialogContentComponent = new DialogContentComponent();
        // dc.currentValue = value;

        // DialogContentComponent.currentValue = value;
        let dialogRef = this._dialog.open(DialogContentComponent);
        dialogRef.componentInstance.currentValue = value;
        dialogRef.componentInstance.attributeKey = key;

        dialogRef.afterClosed().subscribe(result => {
            Function("obj", "value", `obj.` + keyPath +` = value`)(this.codeJSON, result);
            this.codeObject = this.codeJSON;
            this.codeKeys = this.getKeyListfromObject(this.codeJSON, 1, "");
            this.log("result from dialog", [this.codeJSON]);
        });
    }

    onRecordChange(record: Object) {
        this.record = record;
    }

    log(text: string, values: Array<any>) {
        console.log.apply(this, ["%c " + text, "color:red;font-size:20px;"].concat(values));
    }

    ngOnInit() {
        console.log("code object", this.codeObject);
        console.log("code object string", json5.stringify(this.codeObject));
    }

    ngDoCheck() {

    }

}
