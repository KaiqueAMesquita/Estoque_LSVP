const fs = require('fs');
const path = require('path');
// Carrega as variáveis do arquivo .env para o process.env
require('dotenv').config();

// Define o caminho para os arquivos de ambiente do Angular
const targetPath = path.join(__dirname, '../src/environments/environment.ts');
const targetPathProd = path.join(__dirname, '../src/environments/environment.prod.ts');
const targetPathDev = path.join(__dirname, '../src/environments/environment.development.ts');

// Cria o conteúdo do arquivo environment.ts dinamicamente
const envConfigFile = `
export const environment = {
  production: ${process.env.PRODUCTION || false},
  api_url: '${process.env.API_URL}',
  token_key: '${process.env.TOKEN_KEY}'
};
`;

// Escreve o conteúdo nos arquivos de ambiente
const writeEnv = (filePath) => {
  fs.writeFile(filePath, envConfigFile, (err) => {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log(`Angular environment file generated correctly at ${filePath} \n`);
  });
};

writeEnv(targetPath);
writeEnv(targetPathDev);
writeEnv(targetPathProd);

