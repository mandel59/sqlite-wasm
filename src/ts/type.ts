namespace Module {
    export type stack = number & { __type__: "stack" }
    export type i8 = number & { __type__: "i8", __size__: 1 }
    export type i32 = number & { __type__: "i32", __size__: 4 }
    export type ptr<T> = number & { __type__: "ptr", __deref__: T, __size__: 4 }
    export type arr<T extends sized> = { __type__: "arr", __deref__: Array<T> }
    export type sized = { __size__: number }
}