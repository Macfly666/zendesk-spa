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

    // Reattacher JS uniquement pour certains modules
    initModuleJS(moduleName);

  } catch (error) {
    container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  }
}

function initModuleJS(moduleName) {
  if (moduleName === 'mailing_vip') {
    const formVip = document.getElementById('mailingVipForm');
    if (formVip) {
      formVip.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!confirm("Confirmez-vous l'envoi du mailing VIP ?")) {
          return;
        }
        const selectedOptions = Array.from(document.getElementById('audience').selectedOptions).map(option => option.value);

        const body = {
          sujet: document.getElementById('subject').value,
          contenu: document.getElementById('content').value,
          audience: selectedOptions
        };

        try {
          const response = await fetch('https://n8n.ubiflow.net/webhook-test/mailing_vip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (response.ok) {
            showToast("✅ Mailing VIP envoyé avec succès !");
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

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.className = 'show';
  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 3000);
}
