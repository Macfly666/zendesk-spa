async function loadModule(moduleName) {
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Chargement...</p>'; // Loading

  try {
    const response = await fetch(`./modules/${moduleName}.html`);
    if (!response.ok) {
      throw new Error('Erreur de chargement');
    }
    const content = await response.text();
    container.innerHTML = content;

    // 👇 Ajout: Reattach event listeners dynamically
    initModuleJS(moduleName);

  } catch (error) {
    container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  }
}

function initModuleJS(moduleName) {
  if (moduleName === 'mailing') {
    // On réattache le submit
    const form = document.getElementById('mailingForm');
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Submit triggered");

        if (!confirm("Confirmez-vous l'ajout de ce contact à la liste mailing ?")) {
          return;
        }

        const body = {
          compte: document.getElementById('compte').value,
          contact: document.getElementById('contact').value,
          email: document.getElementById('email_contact').value,
          type: document.getElementById('type_contact').value
        };

        console.log("Payload:", body);

        try {
          const response = await fetch('https://n8n.ubiflow.net/webhook-test/mailing_list', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
          });
          if (response.ok) {
            showToast("✅ Contact ajouté avec succès !");
            e.target.reset();
          } else {
            showToast("❌ Erreur : " + await response.text());
          }
        } catch (err) {
          showToast("❌ Problème de connexion.");
        }
      });
    }
  }
}
