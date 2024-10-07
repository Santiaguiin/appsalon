<?php
    foreach ($alertas as $key => $mensajes) {
        foreach ($mensajes as $mensaje) {
?>

    <div class="alerta <?php echo $key; ?>" > <!-- le anadimos a la clase la llave del array de alertas para saber si es alerta de error o alerta de mensaje -->
        <?php echo $mensaje; ?>
    </div>

<?php
        }
    }
?>