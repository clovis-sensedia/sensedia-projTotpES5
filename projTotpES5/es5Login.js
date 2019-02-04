    $("#btnValidar").on('click', function() {
      validar();
    });

    // script específico para manipulação deste HTML
    // cria a chave, altera o QR-CODE e apresenta o modal
	// Acionado pelo botão
    function validar() {
      var senha = $('#senha').val();
      var user = $('#user').val();
      var dado = localStorage.getItem("TOTPKey" + user); // obtém a chave do TOTP em formato base32 que o cadastro criptografou e salvou
      if (!dado) {
        $('#resultado').text('Usuário inexistente!');
        $('#modal').modal('show');
      }
      var prom = decrypt(senha, dado); // descriptografa a chave do TOTP
      prom.then(secret => {
        console.log(secret); // chave
        createTOTPs(secret, comparar);
      })
      .catch(function(err){
        console.error(err);
        $('#resultado').text('Erro!');
        $('#modal').modal('show');
      });;
    }
	function comparar(totps) {
      var modal = $('#modal')
      var totp = $('#totp').val();
      if (totp == totps[0] || totp == totps[1] || totp == totps[2]) {
        $('#resultado').text('Sucesso!');
      } else {
        $('#resultado').text('Erro!');
      }
      modal.modal('show');
    }
