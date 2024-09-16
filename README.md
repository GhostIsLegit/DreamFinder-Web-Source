# DreamFinder Guide

DreamFinder es una herramienta web diseñada para buscar y visualizar información sobre credenciales de inicio de sesión y direcciones IP. Aunque su uso principal está orientado al análisis y administración de información, también puede ser utilizada para actividades como el griefing de servidores de Minecraft y otros fines similares.
Advertencia de Seguridad

Este proyecto no está diseñado para ser expuesto a internet como un servidor real. No cuenta con medidas de seguridad adecuadas para entornos de producción y está destinado únicamente para uso local y en entornos controlados. El uso de esta herramienta para fines malintencionados puede ser ilegal y está sujeto a sanciones. No lo utilices en un entorno accesible públicamente sin antes implementar las debidas medidas de seguridad y considera las implicaciones legales y éticas de su uso.
Nota sobre las Bases de Datos

No se proporcionarán bases de datos para las búsquedas. Debes crear la carpeta dbs en la raíz del proyecto y colocar tus propias bases de datos en esta carpeta. Asegúrate de que los archivos de base de datos estén en el formato y ubicación esperados para que la aplicación pueda acceder a ellos correctamente.
Instalación

## Instalamos Las Dependencias

Para comenzar, clona el repositorio del proyecto en tu máquina local:

    git clone https://github.com/GhostIsLegit/DreamFinder-Web-Source.git
    cd DreamFinder-Web-Source

En la raíz del proyecto, donde se encuentra el archivo package.json, ejecuta el siguiente comando para instalar todas las dependencias necesarias:
    
    npm install

Esto instalará las siguientes dependencias:

    express: Framework web para Node.js.
    cors: Middleware para habilitar CORS (Cross-Origin Resource Sharing).
    fs: Módulo para trabajar con el sistema de archivos (incluido en Node.js por defecto).
    path: Módulo para manejar rutas de archivos (incluido en Node.js por defecto).
    os: Módulo para acceder a información del sistema operativo (incluido en Node.js por defecto).

## Modificaciones para Acceso Externo

Por defecto, la aplicación está configurada para aceptar solicitudes únicamente desde localhost. Si deseas permitir el acceso desde otros dispositivos en la misma red local, debes modificar el archivo public/script.js para que maneje solicitudes desde otros dispositivos.

Edita el archivo public/script.js en un editor de texto.

Busca la línea de código donde se define la URL base para las solicitudes. Debe parecerse a esto:

    const serverIp = 'localhost'; // Cambia esto a la IP de tu PC

Cambia localhost por la dirección IP de la máquina donde está ejecutando el servidor. Por ejemplo, si la dirección IP de tu máquina es 192.168.1.100, la línea debería ser:

    const serverIp = 'http://192.168.1.100'; // Cambia esto a la IP de tu PC

Guarda los cambios en public/script.js.

## Ejecución

Para iniciar el servidor, asegúrate de estar en la raíz del proyecto y ejecuta el siguiente comando:

    node server/server.js

Durante la ejecución, el servidor mostrará las direcciones IP locales disponibles en la consola. El servidor estará disponible en http://localhost:3000 y en las IPs locales que se muestren durante la ejecución en el puerto 3000.

Uso:

    Interfaz Web: Abre http://localhost:3000 en tu navegador para acceder a la interfaz web de DreamFinder-Web.
    Buscar Información: Utiliza la barra de búsqueda para encontrar credenciales de inicio de sesión o direcciones IP.

## Preview:

![Preview](https://github.com/GhostIsLegit/DreamFinder-Web-Source/blob/main/prev.png)
