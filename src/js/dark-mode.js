document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // botão 
    if (!document.getElementById("darkModeToggle")) {
        const nav = document.querySelector(".navbar .container");
        if (nav) {
            const toggle = document.createElement("button");
            toggle.id = "darkModeToggle";
            toggle.title = "Alternar modo escuro";
            toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            nav.appendChild(toggle);

            const icon = toggle.querySelector("i");

            // Função de alternar tema
            toggle.addEventListener("click", () => {
                body.classList.toggle("dark-mode");
                const dark = body.classList.contains("dark-mode");
                icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
                localStorage.setItem("darkMode", dark);
            });

            // Mantém o modo salvo
            if (localStorage.getItem("darkMode") === "true") {
                body.classList.add("dark-mode");
                icon.className = "fa-solid fa-sun";
            }
        }
    }
});
