import { Component, OnInit } from '@angular/core';
import 'codemirror/mode/javascript/javascript';

/// <reference path="json5.d.ts" />
import * as json5 from 'json5';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

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
                input: {

                },
                output: {

                }
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
        }
    }
}`;
    public record: Object = {};
    public schema: Object = {};

    public cmOptions: Object = {};
    public jsonViewerOptions: Object = {};

    constructor() {
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
        return json5.parse(this.code);
    }

    get codeKeys(): Array<any> {
        let obj = this.codeObject;        
        return this.getKeyListfromObject(obj);
    }

    getKeyListfromObject(obj: Object): Array<any> {
        let retArr = [];

        for (let i in obj) {
            if (obj[i] instanceof Array) {
                retArr.push([i, this.getObjectFromList(obj[i])]);
            } else if (obj[i] instanceof Object) {
                retArr.push([i, this.getKeyListfromObject(obj[i])]);
            } else {
                retArr.push([i, obj[i]]);
            }
        }
        return retArr;
    }

    getObjectFromList(arr: Array<any>): Array<any> {
        let retArr = [];

        arr.forEach((value, i) => {
            if (value instanceof Array) {
                retArr.push([i, [this.getObjectFromList(value)]]);
            } else if (value instanceof Object) {
                retArr.push([i, this.getKeyListfromObject(value)]);
            } else {
                retArr.push([i, value]);
            }
        });

        return retArr;
    }

    onRecordChange(record: Object) {
        this.record = record;
    }

    ngOnInit() {
        console.log("code object", this.codeObject);
    }

}
