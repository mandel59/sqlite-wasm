# SQLite compiled to WebAssembly for the Uno Wasm Bootstrapper

This repository is about building the SQLite library to WebAssembly, and use it as
a Nuget package in an application using the [Uno.Wasm.Bootstrap](https://github.com/nventive/Uno.Wasm.Bootstrap).

It is primarily made for the [Uno.SQLiteNet](https://github.com/nventive/Uno.sqlite-net) package.

This repository is based on the work from [Ryusei YAMAGUCHI](https://github.com/mandel59/sqlite-wasm).

## Architecture

This package exposes the native APIs of the SQLite API to be consumed by other libraries expecting this same C API. It can be used as follows:

```javascript
var SQLiteNative = require('sqlite3');

var res = SQLiteNative.Database.open(fileName, null, { mode: "rwc", cache: "private" });

// Call other apis...

if(res.Code == 0){
  var result = SQLiteNative.Database.close_v2(res.pDB, true);
}
```

This packages is built around the [MODULARIZE_INSTANCE](http://kripken.github.io/emscripten-site/docs/getting_started/FAQ.html#how-can-i-tell-when-the-page-is-fully-loaded-and-it-is-safe-to-call-compiled-functions) feature of Emscripten, to avoid instance clashes with the `Module` class of of other emscripten built libraries (particularly Mono-wasm).

For the same reason, the file system is currently restricted to this module, meaning that [the `Database.open` API](src/ts/database.ts) allows for providing a database using an `UInt8Array` version of a file. The close API provides a way for getting this file back as a memory array.

## TODO
- Support for VFS persistence configuration
- Enable Emscripten -O3
- Implement all the native APIs
- Unit Tests

## Related

- [SQLite compiled to WebAssembly for the Uno Wasm Bootstrapper](#sqlite-compiled-to-webassembly-for-the-uno-wasm-bootstrapper)
	- [Architecture](#architecture)
	- [TODO](#todo)
	- [Related](#related)
