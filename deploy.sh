#!/bin/bash

# Instala o angular-cli-ghpages se não estiver instalado
if ! command -v npx &> /dev/null; then
    echo "Instalando angular-cli-ghpages..."
    npm install -g angular-cli-ghpages
fi

# Faz o build da aplicação
echo "Fazendo build da aplicação..."
ng build --configuration=production

# Faz o deploy para o GitHub Pages
echo "Fazendo deploy para o GitHub Pages..."
npx angular-cli-ghpages --dir=dist/clinica-frontend-temp --repo=https://github.com/projetos-univesp-pji/clinica-estetica-frontend.git

echo "Deploy concluído!" 