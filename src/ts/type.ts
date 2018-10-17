namespace Module {
    export type stack = number & { __type__: "stack" }
    export type i8 = number & { __type__: "i8", __size__: 1 }
    export type i32 = number & { __type__: "i32", __size__: 4 }
    export type double = number & { __type__: "double", __size__: 8 }
    export type ptr<T extends { __type__: any }> = number & { __type__: "ptr", __deref__: T, __size__: 4 }
    export type arr<T extends sized> = { __type__: "arr", __deref__: Array<T> }
    export type str = { __type__: "str" }
    export type fn<F extends Function> = { __type__: "fn", __deref__: F }
    export type sized = { __type__: unknown, __size__: number }
}