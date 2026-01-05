let cachedTemplate = null;

async function loadTemplate() {
  if (cachedTemplate) return cachedTemplate;

  const response = await fetch("/whatsapp_template.txt");
  const text = await response.text();
  cachedTemplate = text;

  return text;
}

export async function triggerWhatsApp(name, orderType) {
  if (!name || !orderType) {
    alert("Missing name or order type");
    return;
  }

  const template = await loadTemplate();

  const message = template
    .replace("{{name}}", name)
    .replace("{{order_type}}", orderType);

  const encodedMessage = encodeURIComponent(message);

  const PHONE_NUMBER = "91xxxxxxxxxx"; // Replace with the actual phone number

  const whatsappURL = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;

  window.open(whatsappURL, "_blank");
}
