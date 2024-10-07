<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController {
    public static function index() {
        $servicios = Servicio::all();

        echo json_encode($servicios);
    }

    public static function guardar() {

        // Almacena la cita y nos devuelve su id
        $cita =  new Cita($_POST);
        $resultado = $cita -> guardar();

        $idCita = $resultado['id'];

        // Almacena los servicios y el id de la misma cita
        $idServicios = explode(',', $_POST['servicios']); // extraer los id de los servicios separados
        foreach ($idServicios as $idServicio) {
            $args = [
                'citaId' => $idCita,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio -> guardar();
        }

        //retornamos una respuesta para mostrar al usuario
        echo json_encode(['resultado' => $resultado]);
    }

    public static function eliminar() {
        if ($_SERVER['REQUEST_METHOD'] === "POST") {
            
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            header('location:' . $_SERVER["HTTP_REFERER"]);
        }
    }
}
