#!/bin/bash
mkdir ../zips
rm -f ../zips/atividade2.zip
mv index.html realindex.html
mv atividade2.html index.html
zip -r ../zips/atividade2.zip index.html src/atividade2/* lib/* assets/boat/* assets/boat2/* assets/terrain_textures/* assets/arvore* assets/waternormals.jpg *.css music/*
mv index.html atividade2.html
mv realindex.html index.html