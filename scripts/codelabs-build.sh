#!/bin/bash
echo "Generando sitio estático de la documentación cosechada"
rm -rdf codelabs/build
for md in codelabs/src/**/*.md;do bin/claat-linux-amd64 export -o codelabs/build $md; done;