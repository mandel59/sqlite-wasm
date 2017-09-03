namespace Module {
    export type stack = number & { __type__: "stack" }
    export type i8 = number & { __type__: "i8", __size__: 1 }
    export type i32 = number & { __type__: "i32", __size__: 4 }
    export type ptr<T> = number & { __type__: "ptr", __deref__: T, __size__: 4 }
    export type arr<T extends sized> = number & { __type__: "arr", __deref__: Array<T>, __size__: 4 }
    export type sized = { __size__: number }

    export declare function getValue<T extends ptr<any>>(ptr: ptr<T>, type: "*", noSafe?: boolean): T | 0;
    export declare function getValue(ptr: ptr<i32>, type: "i32", noSafe?: boolean): i32;
    export declare function getValue(ptr: ptr<number>, type: "double", noSafe?: boolean): number;

    export declare function UTF8ToString(ptr: ptr<string>): string
    export declare function stringToUTF8(str: string, outPtr: ptr<string>, maxBytesToWrite: number): void

    export const stackSave
        : () => stack
        = Module["Runtime"].stackSave
    export const stackRestore
        : (stack: stack) => void
        = Module["Runtime"].stackRestore
    export const stackAlloc
        : <T extends sized>(size: number & T["__size__"]) => ptr<T>
        = Module["Runtime"].stackAlloc
    export const addFunction
        : <T extends Function>(func: T) => ptr<T>
        = Module["Runtime"].addFunction
    export const removeFunction
        : <T extends Function>(ptr: ptr<T>) => void
        = Module["Runtime"].removeFunction
}