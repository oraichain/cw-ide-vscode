#!/bin/bash
command -v shellcheck >/dev/null && shellcheck "$0"

echo "Info: sccache stats before build"
sccache -s
if [ $? -eq 0 ]; then
    export RUSTC_WRAPPER=sccache
fi
set -o errexit -o nounset -o pipefail

contractdir=$(realpath "$1")

basedir=$(pwd)
build_release="${3:-true}"
name=$(basename "$contractdir")
name=${name//-/_}
cd "$contractdir"
CARGO=$([[ -f 'Xargo.toml' && $(rustup default) =~ ^nightly.* ]] && echo 'xargo' || echo 'cargo')

echo "Building contract in $contractdir"

# Linker flag "-s" for stripping (https://github.com/rust-lang/cargo/issues/3483#issuecomment-431209957)
# Note that shortcuts from .cargo/config are not available in source code packages from crates.io
mkdir -p artifacts

if [ "$build_release" == 'true' ]; then
    RUSTFLAGS='-C link-arg=-s' $CARGO build -q --release --target-dir "$basedir/target" --target wasm32-unknown-unknown
    # wasm-optimize on all results
    echo "Optimizing $name.wasm"
    wasm-opt -Os "$basedir/target/wasm32-unknown-unknown/release/$name.wasm" -o "artifacts/$name.wasm"
else
    $CARGO build -q --target-dir "$basedir/target" --target wasm32-unknown-unknown
    cp "$basedir/target/wasm32-unknown-unknown/debug/$name.wasm" artifacts
fi

build_schema="${2:-false}"
# create schema if there is
if [ "$build_schema" == 'true' ]; then
    echo "Creating schema in $contractdir"
    (
        cargo run -q --example schema --target-dir "$basedir/target"
    )
fi

# show content
du -h "artifacts/$name.wasm"

echo "done"
