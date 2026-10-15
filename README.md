# CSHCLI web

Web pública de instalación de CSHCLI. Código estático, sin dependencias de ejecución.

Sitio: https://jtpydk5gyh-alt.github.io/cshcli-web/

CLI: https://github.com/jtpydk5gyh-alt/cshcli

## Desarrollo

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory dist
node --check dist/app.js
python scripts/check_site.py
```

Las animaciones están pausadas por defecto. La terminal mantiene una altura fija y los ejemplos son ilustrativos. El comando de instalación descarga la rama main del CLI; requiere Python 3.11 o superior.

## Publicación y acceso

Los cambios se proponen mediante pull requests. La rama main exige el check site-check y bloquea pushes directos, force pushes y borrados, también para administradores. El repositorio no tiene colaboradores con permisos de escritura; el propietario es jtpydk5gyh-alt.

GitHub Actions valida todos los PR y publica dist en GitHub Pages después de integrar cambios en main. Su token tiene lectura del código; el job de publicación solo añade permisos de Pages y OIDC. Las acciones oficiales se fijan por SHA. El entorno github-pages solo admite main.

## Privacidad y licencia

Los términos, privacidad, cookies y atribuciones están en dist/legal.html. El contacto utiliza el alias y perfil público de GitHub elegidos por el propietario. El código propio no incorpora analítica ni almacenamiento persistente. GitHub Pages registra IP por seguridad conforme a sus políticas. Las tipografías se sirven localmente con sus licencias SIL OFL.

El código utiliza la licencia MIT. El fondo original se generó con image_gen y se sirve como WebP de 116.150 bytes, aproximadamente un 94,5 % menos que el PNG original. Referencias consultadas: https://www.vantajs.com/, https://motion.dev/examples y https://animejs.com/.
