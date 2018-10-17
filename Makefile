# dependencies

SQLITE_AMALGAMATION = sqlite-amalgamation-3200100
SQLITE_AMALGAMATION_ZIP_URL = https://www.sqlite.org/2017/sqlite-amalgamation-3200100.zip
SQLITE_AMALGAMATION_ZIP_SHA1 = e9dc46fc55a512b5d2ef97fd548b7ab4beb2d3e3

EXTENSION_FUNCTIONS = extension-functions.c
EXTENSION_FUNCTIONS_URL = http://www.sqlite.org/contrib/download/extension-functions.c?get=25
EXTENSION_FUNCTIONS_SHA1 = da39a3ee5e6b4b0d3255bfef95601890afd80709

# source files

EXPORTED_FUNCTIONS_JSON = src/exported_functions.json

# temporary files

BITCODE_FILES = temp/bc/sqlite3.bc temp/bc/extension-functions.bc

# build options

EMSCRIPTEN ?= /usr/bin

EMCC = '$(EMSCRIPTEN)/emcc'

TSC = node_modules/typescript/bin/tsc

CFLAGS = \
	-D_HAVE_SQLITE_CONFIG_H \
	-Isrc/c -I'deps/$(SQLITE_AMALGAMATION)'

EMFLAGS = \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS=@$(EXPORTED_FUNCTIONS_JSON) \
	-s RESERVED_FUNCTION_POINTERS=64 \
	-s WASM=1 \
	--post-js temp/api.js \

EMFLAGS_DEBUG = \
	-s INLINING_LIMIT=10 \
	-O1

EMFLAGS_DIST = \
	-s INLINING_LIMIT=50 \
	--closure 1 \
	-O3

# directories

.PHONY: all
all: dist

.PHONY: clean
clean:
	rm -rf dist debug temp

.PHONY: clean-all
clean-all:
	rm -rf dist debug temp deps cache

## cache

.PHONY: clean-cache
clean-cache:
	rm -rf cache

cache/$(SQLITE_AMALGAMATION).zip:
	mkdir -p cache
	curl '$(SQLITE_AMALGAMATION_ZIP_URL)' -o $@

cache/$(EXTENSION_FUNCTIONS):
	mkdir -p cache
	curl '$(EXTENSION_FUNCTIONS_URL)' -o $@

## deps

.PHONY: clean-deps
clean-deps:
	rm -rf deps

.PHONY: deps
deps: deps/$(SQLITE_AMALGAMATION) deps/$(EXTENSION_FUNCTIONS) deps/$(EXPORTED_FUNCTIONS)

deps/$(SQLITE_AMALGAMATION): cache/$(SQLITE_AMALGAMATION).zip
	mkdir -p deps
	echo '$(SQLITE_AMALGAMATION_ZIP_SHA1)' 'cache/$(SQLITE_AMALGAMATION).zip' | sha1sum -c
	rm -rf $@
	unzip 'cache/$(SQLITE_AMALGAMATION).zip' -d deps/
	touch $@

deps/$(EXTENSION_FUNCTIONS): cache/$(EXTENSION_FUNCTIONS)
	mkdir -p deps
	echo '$(EXTENSION_FUNCTIONS_SHA1)' 'cache/$(EXTENSION_FUNCTIONS)' | sha1sum -c
	cp 'cache/$(EXTENSION_FUNCTIONS)' $@

## temp

.PHONY: clean-temp
clean-temp:
	rm -rf temp

temp/bc/shell.bc: deps/$(SQLITE_AMALGAMATION) src/c/config.h
	mkdir -p temp/bc
	$(EMCC) $(CFLAGS) 'deps/$(SQLITE_AMALGAMATION)/shell.c' -o $@

temp/bc/sqlite3.bc: deps/$(SQLITE_AMALGAMATION) src/c/config.h
	mkdir -p temp/bc
	$(EMCC) $(CFLAGS) -s LINKABLE=1 'deps/$(SQLITE_AMALGAMATION)/sqlite3.c' -o $@

temp/bc/extension-functions.bc: deps/$(EXTENSION_FUNCTIONS) src/c/config.h
	mkdir -p temp/bc
	$(EMCC) $(CFLAGS) -s LINKABLE=1 'deps/$(EXTENSION_FUNCTIONS)' -o $@

temp/api.js: $(wildcard src/ts/*)
	$(TSC)

## debug
.PHONY: clean-debug
clean-debug:
	rm -rf debug

.PHONY: debug
debug: debug/sqlite3.html

debug/sqlite3.html: $(BITCODE_FILES) $(EXPORTED_FUNCTIONS_JSON) temp/api.js
	mkdir -p debug
	$(EMCC) $(EMFLAGS) $(EMFLAGS_DEBUG) $(BITCODE_FILES) -o $@

## dist

.PHONY: clean-dist
clean-dist:
	rm -rf dist

.PHONY: dist
dist: dist/sqlite3.html

dist/sqlite3.html: $(BITCODE_FILES) $(EXPORTED_FUNCTIONS_JSON) temp/api.js
	mkdir -p dist
	$(EMCC) $(EMFLAGS) $(EMFLAGS_DIST) $(BITCODE_FILES) -o $@
