export default texmath;
declare function texmath(md: any, options: any): void;
declare namespace texmath {
    function mergeDelimiters(delims: any): {
        inline: never[];
        block: never[];
    };
    function inline(rule: any): (state: any, silent: any) => any;
    function block(rule: any): (state: any, begLine: any, endLine: any, silent: any) => any;
    function render(tex: any, displayMode: any, options: any): any;
    function use(katex: any): typeof texmath;
    const inlineRuleNames: string[];
    const blockRuleNames: string[];
    function $_pre(str: any, outerSpace: any, beg: any): boolean;
    function $_post(str: any, outerSpace: any, end: any): boolean;
    namespace rules {
        namespace brackets {
            const inline: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            const block: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
        }
        namespace doxygen {
            const inline_1: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { inline_1 as inline };
            const block_1: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { block_1 as block };
        }
        namespace gitlab {
            const inline_2: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { inline_2 as inline };
            const block_2: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { block_2 as block };
        }
        namespace julia {
            const inline_3: ({
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
                spaceEnclosed?: undefined;
                pre?: undefined;
                post?: undefined;
            } | {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
                spaceEnclosed: boolean;
                pre: (str: any, outerSpace: any, beg: any) => boolean;
                post: (str: any, outerSpace: any, end: any) => boolean;
            })[];
            export { inline_3 as inline };
            const block_3: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { block_3 as block };
        }
        namespace kramdown {
            const inline_4: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { inline_4 as inline };
            const block_4: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { block_4 as block };
        }
        namespace beg_end {
            const inline_5: never[];
            export { inline_5 as inline };
            const block_5: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { block_5 as block };
        }
        namespace dollarsOld {
            const inline_6: ({
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
                displayMode: boolean;
                pre: (str: any, outerSpace: any, beg: any) => boolean;
                post: (str: any, outerSpace: any, end: any) => boolean;
                outerSpace?: undefined;
            } | {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
                outerSpace: boolean;
                pre: (str: any, outerSpace: any, beg: any) => boolean;
                post: (str: any, outerSpace: any, end: any) => boolean;
                displayMode?: undefined;
            })[];
            export { inline_6 as inline };
            const block_6: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { block_6 as block };
        }
        namespace dollars {
            const inline_7: ({
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
                displayMode: boolean;
                pre: (str: any, outerSpace: any, beg: any) => boolean;
                post: (str: any, outerSpace: any, end: any) => boolean;
                outerSpace?: undefined;
            } | {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
                outerSpace: boolean;
                pre: (str: any, outerSpace: any, beg: any) => boolean;
                post: (str: any, outerSpace: any, end: any) => boolean;
                displayMode?: undefined;
            })[];
            export { inline_7 as inline };
            const block_7: {
                name: string;
                rex: RegExp;
                tmpl: string;
                tag: string;
            }[];
            export { block_7 as block };
        }
    }
}
