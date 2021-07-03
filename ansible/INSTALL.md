# Instalación con Ansible

## Prerequisitos

### Instalar git debian 10

Ejecutar los siguientes comandos:

```shell
$ sudo apt-get update
$ sudo apt-get install git
```

### Instalar ansible debian 10

Ejecutar los siguientes comandos:

```shell
$ sudo apt-get update
$ sudo apt-get install ansible
```
### Configuración para ci/cd de la aplicación

Crear el siguiente directorio

```shell
$ sudo mkdir /opt/vars
```

Crear el archivo de configuración general de la aplicación con las variables a usarse en el ambiente:
```shell
$ sudo vim /opt/vars/.env
```

El archivo .env creado debe contener todas las configuraciones necesarias para el despliegue
El modulo nginx esta configurado para desplegar la aplicacion sin un subpath por lo que es necesario que en el archivo .env el valor de PATH_SUBDOMAIN se encuentre seteado como '/'
```YAML
PATH_SUBDOMAIN=/
```

### Instalación de gitlab-runner

1. Descargar el binario correspondiente al servidor utilizado:

```shell
$ sudo wget -O /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64
```

2. Asignar permisos para ejecutar el archivo descargado

```shell
$ sudo chmod +x /usr/local/bin/gitlab-runner
```
3. Crear un usuario gitlab ci en el servidor

```shell
 $ sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash
```


4. Dar permisos al usuario gitlab-runner editando el archivo /etc/sudoers agregar la siguiente linea:
```config
 gitlab-runner ALL=(ALL) NOPASSWD:ALL
```

5. Instalar y arrancar el servicio 'gitlab-runner'

```shell
sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
```

5. Eliminar el archivo .bash_logout
```shell
sudo rm /home/gitlab-runner/.bash_logout
```

## Registro del runner en el repositorio https://gitlab.agetic.gob.bo/

1. Ejecutar el siguiente comando:
```shell
$ sudo gitlab-runner register
```

2. Introduzca la direccion URL del servidor gitlab:
```shell
Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
https://gitlab.agetic.gob.bo/
```
3. Introduzca el token que se le asigna para registrar el token (Puede encontrar este en la seccion pipelines del proyecto a registrar):
```shell
Please enter the gitlab-ci token for this runner
xxx
```
4. Introduzca una descripcion para el runner, puede editar esta configuración luego desde el panel del proyecto en el repositorio gitlab:
```shell
Please enter the gitlab-ci description for this runner
[hostame] Runner de la aplicación para vacunas
```
5. Introduzca los tags asociados al runner
```shell
Please enter the gitlab-ci tags for this runner (comma separated):
runner-<ambiente>
```
6. Introduzca los tipos de comandos que ejecutara el runner (se recomienda solo shell):
```shell
Please enter the executor: ssh, docker+machine, docker-ssh+machine, kubernetes, docker, parallels, virtualbox, docker-ssh, shell:
shell
```
7. Reiniciar el runner:
```shell
$ sudo service gitlab-runner restart
```