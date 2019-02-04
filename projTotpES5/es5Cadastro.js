    $("#btnGerar").on('click', function() {
      newTOTPKey(showQrCode);
    });
    $("#btnEfetivar").on('click', function() {
      salvaTOTPKey();
    });
    
    var lastsecret;
    // script específico para manipulação deste HTML
    // cria a chave, altera o QR-CODE e apresenta o modal
	// Acionado pelo botão
    function showGenerateOTPs(totps) {
      $('#otp1').text(totps[0]);
      $('#otp2').text(totps[1]);
      $('#otp3').text(totps[2]);
    }
    function showQrCode(secret) {
      var modal = $('#qrModal')
      modal.find('#secretHex').val(secret);
      // obtém uma imagem QRCode do serviço do Google representando a chave secreta
      $('#qrImg').attr('src', 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/user@host.com%3Fsecret%3D' + secret);
      modal.modal('show');
      createTOTPs(secret, showGenerateOTPs);
      lastsecret = secret;
      setInterval(timer, 1000);
    }
    $('#qrModal').on('hidden.bs.modal', function (e) {
      // cancela o timer
      var max = setTimeout(function(){},1);
        for (var i = 1; i <= max ; i++) {
            window.clearInterval(i);
            window.clearTimeout(i);
        }
    });
    function timer()
    {
      var epoch = Math.round(new Date().getTime() / 1000.0);
      var countDown = 30 - (epoch % 30);
      if (epoch % 30 == 0) createTOTPs(lastsecret, showGenerateOTPs);
      $('#avisoTimer').text('Senhas serão atualizadas em: ' + countDown);
    }
    function salvaTOTPKey() {
      // versão simplificada, não valida a senha digitada
      var senha = $('#senha').val();
      var user = $('#user').val();
      var prom = encrypt(senha, lastsecret);
      prom.then(dado => {
        console.log(dado);
        localStorage.setItem("TOTPKey" + user, dado);
        $('#qrModal').modal('hide');
      });
    }
