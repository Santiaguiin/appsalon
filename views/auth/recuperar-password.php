<h1 class="nombre-pagina">Recuperar Password</h1>

<p class="descripcion-pagina">Coloca tu nuevo password a continuacion</p>

<?php  include_once __DIR__ . '/../templates/alertas.php'; ?>

<?php if ($error) { return; } ?>
<form class="formulario" method="POST">
    <div class="campo">
        <label for="password">Password</label>
        <input 
            type="password"
            id="password"
            name="password"
            placeholder="Tu nuevo password"
        />
    </div>
    <input type="submit" class="boton" value="Guardar nuevo password">
</form>
<div class="acciones">
    <a href="/">Ya tienes una cuenta? inicia sesion</a>
    <a href="/crear-cuenta">Aun no tienes una cuenta? Crear una</a>
</div>
