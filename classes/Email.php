<?php 

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email {

    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion(){

        //Crear el objeto de email
        $mail = new PHPMailer();
        
        //se encuentra en el mailtrap
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];

        //quien lo envia 
        $mail->setFrom('cuentas@santiappsalon.com');
        //donde se envia
        $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        //que va a decir el email como mensaje inicial
        $mail->Subject = 'Confirma tu cuenta';

        //Activar el HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';//usar caracteres


        //contenido del email
        $contenido = "<html>";
        $contenido .= "<p><strong> Hola " . $this->nombre . "<strong> Has creado tu cuenta en AppSalon, solo debes confirmarla presionando el siguiente enlace</p>";
        $contenido .= "<p>Presiona aqui: <a href='". $_ENV['APP_URL'] ."/confirmar-cuenta?token=". $this->token ."'> Confirmar Cuenta </a> </p>";
        $contenido .= "<p> Si no solicitaste esta cuenta puedes ignorar el mensaje</p>";
        $contenido .= "</html>";

        //contenido que tendra el body
        $mail->Body = $contenido;//le enviamos al body del email el contenido que ya construimos con la variable

        //Enviar email
        $mail->send();
    }

    public function enviarInstrucciones() {

        //Crear el objeto de email
        $mail = new PHPMailer();

        //se encuentra en el mailtrap
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];

        //quien lo envia 
        $mail->setFrom('cuentas@santiappsalon.com');
        //donde se envia
        $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
        //que va a decir el email como mensaje inicial
        $mail->Subject = 'Reestablecer tu password';

        //Activar el HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';//usar caracteres


        //contenido del email
        $contenido = "<html>";
        $contenido .= "<p><strong> Hola " . $this->nombre . "<strong> Has solicitado reestablecer tu password, sigue el siguiente enlace para hacerlo. </p>";
        $contenido .= "<p>Presiona aqui: <a href='". $_ENV['APP_URL'] ."/recuperar?token=". $this->token ."'> Reestablecer password </a> </p>";
        $contenido .= "<p> Si no solicitaste este cambio puedes ignorar el mensaje</p>";
        $contenido .= "</html>";

        //contenido que tendra el body
        $mail->Body = $contenido;//le enviamos al body del email el contenido que ya construimos con la variable

        //Enviar email
        $mail->send();

    }
}