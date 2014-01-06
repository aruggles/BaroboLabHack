#!/bin/bash

echo -n ": html-gen.hs |> runghc %f |> "
perl -l40 -ne 'm%(html/.*).html% and print "${1}.html"' html-gen.hs
echo
