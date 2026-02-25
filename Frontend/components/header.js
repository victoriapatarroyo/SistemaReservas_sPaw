class Header extends HTMLElement {
    connectedCallback() {

        this.innerHTML = `
            <nav class="navbar navbar-expand-lg menu">
                <div class="container-fluid d-flex align-items-center">
                    <a class="navbar-brand d-flex align-items-center" href="../index.html">
                        <img class="logo" src="../../IMG/logo-row-02.png" alt="logo-sPaw">
                    </a>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 gap-4 pe-2">
                        <li class="nav-item">
                            <a class="nav-link" href="../index.html">Inicio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./quienesSomos.html">Quienes somos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./servicios.html">Servicios</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./contactenos.html">Contáctanos</a>
                        </li>
                    </ul>
                    <a href="./inicioSesion.html" class="boton-login" id="btnLogin">Iniciar Sesión</a>
                    </div>
                </div>
            </nav>
        `;

        this.setActiveLink();
    }

    setActiveLink() {
    const path = window.location.pathname;

    const currentPage = path.split("/").pop();
    const links = this.querySelectorAll(".nav-link");

    links.forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
 }

}

customElements.define("header-component", Header);
