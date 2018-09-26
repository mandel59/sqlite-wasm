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
    export declare function lengthBytesUTF8(str: string): number

    export declare function stackSave(): stack;
    export declare function stackRestore(stack: stack): void;
    export declare function stackAlloc<T extends sized>(size: number & T["__size__"]): ptr<T>;
    export declare function addFunction<T extends Function>(func: T): ptr<T>;
    export declare function removeFunction<T extends Function>(ptr: ptr<T>): void;
}
