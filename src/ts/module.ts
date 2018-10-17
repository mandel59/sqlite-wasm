namespace Module {
    type NativeJsTypeSignature =
        | "undefined"
        | "boolean"
        | "string"
        | "number"
        | "array"

    type NativeJsTypeOf<S> =
        S extends NativeJsTypeSignature ? {
            "undefined": undefined
            "boolean": boolean
            "string": string
            "number": number
            "array": Int8Array | i8[]
        }[S]
        : never

    export declare function cwrap<
        ReturnType extends Exclude<NativeJsTypeSignature, "array">,
        ArgTypes extends Array<NativeJsTypeSignature>>(
            ident: string,
            returnType: ReturnType,
            argTypes: ArgTypes): (...args: { [i in keyof ArgTypes]: NativeJsTypeOf<ArgTypes[i]> }) => NativeJsTypeOf<ReturnType>

    export declare function getValue<T extends ptr<any>>(ptr: ptr<T>, type: "*", noSafe?: boolean): T | 0;
    export declare function getValue(ptr: ptr<i32>, type: "i32", noSafe?: boolean): i32;
    export declare function getValue(ptr: ptr<number>, type: "double", noSafe?: boolean): number;

    export declare function UTF8ToString(ptr: ptr<str>): string
    export declare function stringToUTF8(str: string, outPtr: ptr<str>, maxBytesToWrite: number): void

    export declare function stackSave(): stack
    export declare function stackRestore(stack: stack): void
    export declare function stackAlloc<T extends sized>(size: number & T["__size__"]): ptr<T>
    export declare function addFunction<T extends Function>(func: T): ptr<T>
    export declare function removeFunction<T extends Function>(ptr: ptr<T>): void
}