<h1 class="nombre-pagina">Panel de Administracion</h1>

<?php include_once __DIR__ . '/../templates/barra.php'; ?>

<h2>Buscar Citas</h2>
<div class="busqueda">
    <form action="" class="formulario">
        <div class="campo">
            <label>Fecha:</label>
            <input 
                type="date"
                id="fecha"
                name="fecha"
                value="<?php echo $fecha; ?>"
            />
        </div>
    </form>
</div>

<?php if (count($citas) === 0) { ?>
        <div class="alerta advertencia">No hay citas para este dia</div>
    <?php } ?>

<div class="citas-admin">
    <ul class="citas">
        <?php 
        $idCita = '';
        foreach ($citas as $key => $cita) { 
            if ($idCita !== $cita->id) {
                $total = 0;
        ?>
           
            <li>
                <p>ID: <span><?php echo $cita->id; ?></span></p>
                <p>Hora: <span><?php echo $cita->hora; ?></span></p>
                <p>Cliente: <span><?php echo $cita->cliente; ?></span></p>
                <p>Email: <span><?php echo $cita->email; ?></span></p>
                <p>Telefono: <span><?php echo $cita->telefono; ?></span></p>
                <h3>Servicios</h3>
                <?php } $idCita = $cita->id; //Fin de if ?>

                <?php $precio = number_format($cita->precio, 0, ',', '.'); // le damos formato al numero (puntos), y le decimos que queremos 0 decimales ?>

                <p class="servicio" ><span> <?php echo $cita->servicio. " " . $precio; ?></span></p>

                <?php 
                    $total += $cita->precio;
                    $total_formateado = number_format($total, 0, ',', '.');
                    $actual = $cita->id; // retorna el id actual 
                    $proximo = $citas[$key + 1]->id ?? 0;//ir aumentando de uno en uno la posicion del arreglo de las citas

                    if (esUltimo($actual, $proximo)) { ?>
                        <p class="total" >Total: <span> $<?php echo $total_formateado ; ?> </span></p>

                        <form action="/api/eliminar" method="POST">
                            <input 
                                type="hidden" 
                                name="id" 
                                value="<?php echo $cita->id; ?>"
                            >
                            <input class="boton-eliminar" type="submit" value="Eliminar">
                        </form>
                <?php } ?>
        <?php } // fin de foreach ?>
    </ul>

</div>

<?php
    $script = "<script src='build/js/buscador.js'></script>";
?>