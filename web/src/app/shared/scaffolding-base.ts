const code: string = String`{
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
export default code;
