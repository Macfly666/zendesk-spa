let quill; // Editor global variable

async function loadModule(moduleName) {
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Chargement...</p>'; // Loading message while fetching

  try {
    const response = await fetch(`./modules/${moduleName}.html`);
    if (!response.ok) {
      throw new Error('Erreur de chargement du module');
    }
    const content = await response.text();
    container.innerHTML = content;

    initModuleJS(moduleName); // Initialise JS spécifique au module après injection

  } catch (error) {
    container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  }
}

function initModuleJS(moduleName) {
  if (moduleName === 'mailing_vip') {
    initializeQuill();
    attachMailingVipForm();
  }

  // ➔ Ajout si d'autres modules nécessitent du JS au chargement
  // else if (moduleName === 'create') {
  //   initCreateModule();
  // }
}

function initializeQuill() {
  quill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: 'Rédigez votre message...',
    modules: {
      toolbar: [
        ['bold', 'italic'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ]
    }
  });
}

function attachMailingVipForm() {
  const form = document.getElementById('mailingVipForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!confirm("Confirmez-vous l'envoi du mailing VIP ?")) {
      return;
    }

    // Remplir le champ caché avec le HTML de Quill
    document.getElementById('content').value = quill.root.innerHTML;

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
        form.reset();
        quill.setContents([]); // Vide l'éditeur après succès
      } else {
        showToast("❌ Erreur : " + await response.text());
      }
    } catch (err) {
      showToast("❌ Problème de connexion.");
    }
  });
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = "show"; // Show the toast
  setTimeout(() => {
    toast.className = toast.className.replace("show", ""); // Hide after 3s
  }, 3000);
}
