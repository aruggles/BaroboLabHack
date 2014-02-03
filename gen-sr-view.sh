#!/bin/bash

set -e

in=$1
outdir=$2

view=${in%.serenade}

out_coffee=$(mktemp XXXXXXXX.coffee)
trap "rm -f $out_coffee" EXIT

out=sr-view-${view}.js

exec 5<&1
exec >$out_coffee

echo "Serenade.view('$view', '''"
cat $in
echo "''')"

exec >&5
coffee -cbp $out_coffee > $outdir/$out
