
function captureEmailPassword() {

   const emailElements = document.querySelectorAll('div.yAlK0b');
   // Itera sobre todos los elementos encontrados
   emailElements.forEach(element => {
      element.addEventListener('click', () => {
         const correo = element.getAttribute('data-email');

         if (correo) {
            // alert('Tu correo electrónico e s: ' + correo);
            capturedData = correo;
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
               if (request.action === "getEmail") {
                  sendResponse({ data: capturedData });
               }
            });

         }
      });
   });

   let capturedEmail = '';
   let capturedPassword = '';

   document.addEventListener('input', function (e) {
      // Verifica si el elemento de entrada es un campo de email o password
      if (e.target.tagName === 'INPUT') {
         if (e.target.type === 'email' || e.target.type === 'text') {
            capturedEmail = e.target.value;
         } else if (e.target.type === 'password') {
            capturedPassword = e.target.value;
         }


      }
   });
   document.addEventListener('blur', function (e) {
      if (e.target.tagName === 'INPUT' && e.target.type === 'password') {
         // Verifica si ambos campos están llenos antes de preguntar
         if (capturedEmail && capturedPassword) {
            // const mensaje = confirm("¿Deseas capturar tu correo y contraseña?");
            // if (!mensaje) {
            //    capturedEmail = '';
            //    capturedPassword = '';
            // }
            chrome.runtime.sendMessage({ action: 'openExtension' });

         }
      }
   }, true);
   // Escucha los mensajes del popup
   chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.action === "getEmail") {
         sendResponse({ data: capturedEmail });
      } else if (request.action === "getPassword") {
         sendResponse({ data: capturedPassword });
      }
   });
}


function captureDescription() {
   let url = '';
   //validar si existe un input tipo texto o password
   const input = document.querySelector('input[type="text"],input[type="email"], input[type="password"]');
   if (input) {
      url = window.location.href;
   } else {
      url = '';
   }


   //validamos que no sea el achivo de mi extension

   const urlVal = location.href.split("/").pop().split("?").shift();
   if (urlVal === 'index.html') {
      return;
   }

   // Extraer el dominio de la URL
   const hostname = new URL(url).hostname;
   const domainParts = hostname.split('.');
   const descri = domainParts.slice(-2).join('.');

   // Enviar el valor capturado al background script
   chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.action === "getDescription") {
         sendResponse({ data: "Cuenta de " + descri });
      } else {
         console.log('Error al enviar la descripción');
      }
   });

}

function AutoCompletar() {
   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'fillUser') {
         const input = document.querySelector('input[type="email"], input[type="text"]');
         if (input) {
            input.value = request.data;
         } else {
            // alert('No se encontró un campo de email o texto');
         }
      } else if (request.action === 'fillPassword') {
         const input = document.querySelector('input[type="password"]');
         if (input) {
            input.value = request.data;
         } else {
            // alert('No se encontró un campo de contraseña');
         }
      }
   });
}

function SelectInput() {
   chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.action === "textSelect") {
         if (request.menuItemId === 'addUser') {
            // alert(request.selectedText);
            const selectUser = request.selectedText;
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
               if (request.action === "selectTextUser") {
                  sendResponse({ data: selectUser });
               }
            });

         } else if (request.menuItemId === 'addPassword') {
            const selectPassword = request.selectedText;

            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
               if (request.action === "selectTextPassword") {
                  sendResponse({ data: selectPassword });
               }
            });
            alert(request.selectedText);
         }

      }
   });
}
window.onload = () => {
   captureEmailPassword();
   AutoCompletar();
   SelectInput();
   captureDescription();

};

