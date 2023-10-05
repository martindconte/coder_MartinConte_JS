//? cargo el usuario logueado en Local Storage

const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogueado'));

if (usuarioLogeado != null) {
    const headerNavBar = document.getElementById('headerNavBar');
    headerNavBar.classList.remove('oculto');
    const headerUsuarioLogueado = document.getElementById('headerUsuarioLogeueado');
    headerUsuarioLogueado.innerText = usuarioLogeado.usuario;
    if (!usuarioLogeado.admin) {
        document.getElementById('headerUsuarioAdmin').remove();
    }
}