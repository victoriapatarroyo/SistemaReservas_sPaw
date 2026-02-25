class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="container">
            <div class="row align-items-center justify-content-between">
                <!-- Logo -->
                <div class="col-md-4 d-flex justify-content-center justify-content-md-start mb-4 mb-md-0">
                    <img src="../../IMG/logo-03.png" class="footer-logo" alt="Logo sPaw">
                </div>
                <!-- Información  -->
                <div class="col-md-8">
                    <div class="row g-4 align-items-start">
                        <!-- Correo -->
                        <div class="col-12 col-md-5">
                            <div class="info-item d-flex gap-3 mb-3">
                                <i class="bi bi-envelope-fill info-icon"></i>
                                <div>
                                    <h6 class="info-title">Correo</h6>
                                    <p class="info-text mb-0">spaw@spaw.com</p>
                                </div>
                            </div>
                            <!-- Teléfono -->
                            <div class="info-item d-flex gap-3">
                                <i class="bi bi-telephone-fill info-icon"></i>
                                <div>
                                    <h6 class="info-title">Teléfono</h6>
                                    <p class="info-text mb-0">+57 3485784413</p>
                                </div>
                            </div>
                        </div>
                        <!-- Horarios -->
                        <div class="col-12 col-md-5">
                            <div class="info-item d-flex gap-3 mb-3">
                                <i class="bi bi-clock-fill info-icon"></i>
                                <div>
                                    <h6 class="info-title">Horarios</h6>
                                    <p class="info-text mb-0">Lun-Dom: 8:00AM - 7:00PM</p>
                                </div>
                            </div>
                            <!-- Dirección -->
                            <div class="info-item d-flex gap-3">
                                <i class="bi bi-geo-alt-fill info-icon"></i>
                                <div>
                                    <h6 class="info-title">Dirección</h6>
                                    <p class="info-text mb-0">Cra 21 #112 - 36, Bogotá, Colombia</p>
                                </div>
                            </div>
                        </div>
                        <!-- Redes -->
                        <div class="col-12 col-md-2 d-flex justify-content-center justify-content-md-end">
                            <div class="social-icons d-flex gap-3">
                                <i class="bi bi-whatsapp"></i>
                                <i class="bi bi-instagram"></i>
                                <i class="bi bi-facebook"></i>
                                <i class="bi bi-envelope-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('footer-component', Footer);