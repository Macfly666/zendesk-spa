function initModuleJS(moduleName) {
  if (moduleName === 'mailing') {
    // Mailing list simple
    const form = document.getElementById('mailingForm');
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Submit triggered (mailing)");

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

  if (moduleName === 'mailing_vip') {
    // Mailing VIP
    const formVip = document.getElementById('mailingVipForm');
    if (formVip) {
      formVip.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Submit triggered (mailing VIP)");

        if (!confirm("Confirmez-vous l'envoi du mailing VIP ?")) {
          return;
        }

        const body = {
          sujet: document.getElementById('subject').value,
          contenu: document.getElementById('content').value,
          audience: document.getElementById('audience').value
        };

        console.log("Payload:", body);

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
    } else {
      console.error("[DEBUG] Form not found after module load (mailing VIP)");
    }
  }
}
