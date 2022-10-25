default: claims.wasm

claims.o: claims.c
	clang --target=wasm32 -c -O3 -flto -ffreestanding -o claims.o claims.c

claims.wasm: claims.o
	$$(which wasm-ld || which wasm-ld-10) --no-entry --export-dynamic --lto-O3 -o claims.wasm claims.o
