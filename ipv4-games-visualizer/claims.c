#define WASM_EXPORT __attribute__((visibility("default")))

#define NUM_NAMES (24011+1)
#define NUM_RECORDS 1269234

typedef unsigned char UINT8;
typedef signed char INT8;

typedef unsigned short UINT16;
typedef signed short INT16;

typedef unsigned int UINT32;
typedef signed int INT32;
typedef float FLOAT32;

WASM_EXPORT
UINT32 dates[NUM_RECORDS];

WASM_EXPORT
UINT16 who[NUM_RECORDS];

WASM_EXPORT
UINT16 stolen_from[NUM_RECORDS];

WASM_EXPORT
UINT8 block[NUM_RECORDS];

UINT32 pos = 0;

WASM_EXPORT
UINT32 scores[NUM_NAMES][256];

WASM_EXPORT
INT32 last_delta[NUM_NAMES][256];

WASM_EXPORT
UINT8 last_touched[NUM_NAMES];

WASM_EXPORT
UINT32 update_position(UINT32 next) {
    for (int i = 0; i < NUM_NAMES; i++) {
        for (int j = 0; j < 256; ++j) {
            last_delta[i][j] = 0;
        }
    }
    for (int i = 0; i < NUM_NAMES; i++) {
        last_touched[i] = 0;
    }

    while (pos < next) {
        scores[who[pos]][block[pos]]++;
        scores[stolen_from[pos]][block[pos]]--;
        last_delta[who[pos]][block[pos]]++;
        last_delta[stolen_from[pos]][block[pos]]--;
        last_touched[who[pos]] = 1;
        last_touched[stolen_from[pos]] = 1;
        ++pos;
    }
    while (pos > next) {
        --pos;
        scores[who[pos]][block[pos]]--;
        scores[stolen_from[pos]][block[pos]]++;
        last_delta[who[pos]][block[pos]]--;
        last_delta[stolen_from[pos]][block[pos]]++;
        last_touched[who[pos]] = 1;
        last_touched[stolen_from[pos]] = 1;
    }

    return pos;
}