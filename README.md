# sensedia-projTotpES5

TOTP - versão ES5

Esta é a implementação do uso da libTotp usando apenas javascript (é usado o LocalStorage para armazenar o cadastro de usuários).

Primeiro é feito um cadastro com usuário, senha e chave de geração de TOTP. A chave de geração é apresentada no formato Base32 e QRCode para inclusão no Google Authenticator. Depois, o usuário deve fazer o login fornecendo a senha e o totp gerado pelo Google Authenticator.
Obs. é possível utilizar a página que implementa o cliente TOTP em javascript (https://clovis-sensedia.github.io/sensedia-clientTotp/) ao invés do Google Authenticator.

As bibliotecas JQuery e Bootstrap são utilizadas apenas para formatação de tela

Para utilizar:

    (Cadastro) Selecionar uma senha, gerar uma chave secreta para o TOTP e cadastrar no Google Authenticator.
    (Login) Autenticar no sistema usando a senha e uma chave temporária gerada no Google Authenticator.

Detalhes da implementação

As funcionalidades foram implementadas com o auxílio da WebCrypto (https://www.w3.org/TR/WebCryptoAPI/#subtlecrypto-interface) que é a forma atualmente recomendada para realizar operações cripográficas em Javascript.

Arquivos:
es6Cadastro.html 	Formulário de cadastro. Esta página solicita uma senha, cria uma chave de geração de TOTPs e apresenta a chave no formato digitável e QR-Code. Ainda possui javascript necessário para armazenar essa chave de geração no próprio navegador (local storage) criptografando com a senha digitada.
es6crypt.js 	Javascript com as rotinas de criptografia. A senha digitada é utilizada para gerar uma chave AES-GCM usando algorítmo PBKDF2. A chave AES-GCM é utilizada nas funções encrypt e decrypt.
es6TOTP.js 	Este arquivo contém as funções solicitadas.

    newTOTPKey() - cria uma chave de geração de TOTPs usando a API WebCrypto
    createTOTPs() - cria 3 TOTPs. Um baseado na hora atual, um para 30 segundos passados e um para 30 segundos no futuro - isto é para suportar alguma diferença na hora do celular e demora na digitação.
    createTOTP() - Cria 1 TOTP para o passo fornecido (horário em segundos dividido por 30). Esta função necessita da chave de geração já importada na WebCrypto, caso a chave esteja no formato de array de bytes deve-se usar a função createTOTPs()

es6login.html 	Esta página obtém a senha do usuário e um TOTP fornecido no celular pelo Google Authenticator (o TOTP também pode ser gerado em javascript pela função createTOTP()). A senha é utilizada para derivar uma chave AES-GCM que depois é utilizada para descriptografar a chave de geração de TOTPs que esta armazenada no local storage do Browser. Usando a chave de geração, a página solicita a geração de 3 TOTPs (chamando a função createTOTPs()). Depois verifica se o TOTP digitado pelo usuário é igual um dos 3 gerados, caso seja apresenta a mensagem de sucesso.

Sobre a geração do TOTP

A função createTOTP() gera TOTPs simplesmente realizando uma assinatura HMAC-SHA1 com a chave de geração sobre o valor do passo (parâmetro time). O valor do passo é calculado no createTOTPs() e é simplesmente os milissegundos a partir de 01/01/1970 dividido por 1000 (para considerar segundos) e depois por 30 (2 passos por minuto)

O TOTP apresentado é uma simplificação da assinatura gerada para facilitar a digitação pelo usuário.
