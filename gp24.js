document.addEventListener('DOMContentLoaded', () => {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(el => {
    const filePath = el.getAttribute('data-include');
    if (filePath) {
      fetch(filePath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
          }
          return response.text();
        })
        .then(html => {
          el.innerHTML = html;  // Inject the HTML content seamlessly
          el.removeAttribute('data-include');  // Optional: Clean up the attribute
        })
        .catch(error => {
          console.error(error);
          el.innerHTML = 'Error loading content.';  // Fallback for errors
        });
    }
  });
});