# SQLite compiled to WebAssembly

## dependencies

### manual install required

- npm
- make
- java (for closure compiler)
- emcc (emscripten)

### installed by commands

- typescript (run `npm install`)
- source code of sqlite (run `make deps`)

## build

```sh
EMSCRIPTEN="/directory/path/to/emscripten" make
```

## Related

- [SQLite compiled to javascript](https://github.com/kripken/sql.js/)
