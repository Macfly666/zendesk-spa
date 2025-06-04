let quill; // Variable globale pour Quill

async function loadModule(moduleName) {
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Chargement...</p>';

  try {
    const response = await fetch(`./modules/${moduleName}.html`);
    if (!response.ok) {
      throw new Error('Erreur de chargement du module');
    }
    const content = await response.text();
    container.innerHTML = content;

    initModuleJS(moduleName);

  } catch (error) {
    container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  }
}

function initModuleJS(moduleName) {
  if (moduleName === 'mailing_vip') {
    initializeQuill();
    attachMailingVipForm();
  } else if (moduleName === 'create') {
    attachCreateForm();
  } else if (moduleName === 'update') {
    attachUpdateForm();
  }
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

    // ✅ SweetAlert2 confirmation
    Swal.fire({
      title: 'Confirmer l\'envoi ?',
      text: "Voulez-vous vraiment envoyer ce mailing VIP ?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#255662',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, envoyer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        document.getElementById('content').value = quill.root.innerHTML;

        const selectedOptions = Array.from(document.getElementById('audience').selectedOptions).map(option => option.value);

        const body = {
          sujet: document.getElementById('subject').value,
          contenu: document.getElementById('content').value,
          audience: selectedOptions
        };

        try {
          const response = await fetch('https://n8n.ubiflow.net/webhook/mailing_vip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (response.ok) {
            showToast("✅ Mailing VIP envoyé avec succès !");
            form.reset();
            quill.setContents([]);
          } else {
            showToast("❌ Erreur : " + await response.text());
          }
        } catch (err) {
          showToast("❌ Problème de connexion.");
        }
      }
    });
  });
}

function attachCreateForm() {
  const form = document.getElementById('createForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    showToast("✅ Organisation créée avec succès !");
  });
}

function attachUpdateForm() {
  const form = document.getElementById('updateForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    showToast("✅ Organisation mise à jour avec succès !");
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}
