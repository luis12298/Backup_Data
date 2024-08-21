
const firebaseConfig = {
   apiKey: "AIzaSyBLJY7KTsbhy0QbKzGQZ3ZGFlDknX9p0Os",
   authDomain: "ctrlusuario.firebaseapp.com",
   databaseURL: "https://ctrlusuario-default-rtdb.firebaseio.com",
   projectId: "ctrlusuario",
   storageBucket: "ctrlusuario.appspot.com",
   messagingSenderId: "305212293999",
   appId: "1:305212293999:web:10ff7d31a7a676f9ab1e9a"
};


firebase.initializeApp(firebaseConfig);
const txtUsername = document.getElementById('txtUsername');
const txtPassword = document.getElementById('txtPassword');
const txtDescri = document.getElementById('txtDescri');

function ultimoId() {


   const database = firebase.database();
   return new Promise((resolve, reject) => {
      var cuentasRef = database.ref('Cuentas/');
      cuentasRef.orderByKey().limitToLast(1).once('value', function (snapshot) {
         snapshot.forEach(function (childSnapshot) {
            var lastId = childSnapshot.child('Id').val();
            resolve(parseInt(lastId) + 1);
         });
      }, reject);
   });
}


async function SaveD(usuario, contra, descri) {


   const database = firebase.database();
   var listRef = database.ref("Cuentas/");
   // para generar un unico id
   var newRef = listRef.push();
   let _id = await ultimoId();
   newRef.set({
      'Id': _id,
      'Usuario': usuario,
      'Contrasena': contra,
      'Descripcion': descri
   })
      .then(() => {
         alert('Guardado con exito');
      })
      .catch((error) => {
         alert('Error al guardar' + error);
      });
}

function MantenerTexto() {


   if (txtUsername && txtPassword && txtDescri) {
      txtUsername.value = localStorage.getItem('username') || '';
      txtPassword.value = localStorage.getItem('password') || '';
      txtDescri.value = localStorage.getItem('descri') || '';
      // Event listeners para guardar datos en localStorage
      txtUsername.addEventListener('input', function () {
         localStorage.setItem('username', txtUsername.value);
      });


      txtPassword.addEventListener('input', function () {
         localStorage.setItem('password', txtPassword.value);
      });


      txtDescri.addEventListener('input', function () {
         localStorage.setItem('descri', txtDescri.value);
      });

      txtDescri.onkeydown = e => (e.key == "Enter") ? btnGuardar.click() : 1;

   }

}

//evitar que se elimene los datos al cargar
MantenerTexto();

//ejecutar evento
document.querySelector('#btnGuardar').addEventListener('click', () => {
   const username = txtUsername.value.trim();
   const password = txtPassword.value.trim();
   const descri = txtDescri.value.trim();

   if (username === '' || password === '' || descri === '') {
      alert('Por favor, rellene todos los campos para poder guardar los datos');
      return;
   }


   SaveD(username, password, descri);

   // Limpiar campos y localStorage
   txtUsername.value = '';
   txtPassword.value = '';
   txtDescri.value = '';
   localStorage.clear();
});

//limpiar
document.querySelector("#btnLimpiar").addEventListener("click", function () {

   const m = confirm("¿Desea limpiar todos los datos?");
   if (!m) {
      return;
   }
   txtUsername.value = '';
   txtPassword.value = '';
   txtDescri.value = '';

   localStorage.clear();
});

//abrir popup datos
document.querySelector('#popup_datos').addEventListener('click', function (event) {
   event.preventDefault();
   var width = 720;
   var height = 400;
   var left = (window.innerWidth - width) / 2;
   var top = (window.innerHeight - height) / 2;
   var options = 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;

   window.open('data.html', 'Datos', options);
});

function LoadDataT() {

   const database = firebase.database();
   const fetchData = database.ref('Cuentas/');

   fetchData.on('value', (snapshot) => {
      const data = snapshot.val();
      let htmlData = '';

      for (let key in data) {
         let value = data[key];

         htmlData += `
           <div class="ticket">
               <div class="description">${value.Descripcion}</div>
               <div class="info">
                   <div id="usuario" title="Pulse clic para llenar">${value.Usuario}</div>
                   <div id="contrasena" title="Pulse clic para llenar">${value.Contrasena}</div>
               </div>
              
           </div>`;
      }

      document.getElementById('tickets-container').innerHTML = htmlData;


      autoFillData();
      searchData();
   });
}

function autoFillData() {
   document.querySelectorAll('#usuario').forEach(el => {
      el.addEventListener('click', () => {
         const user = el.textContent.trim();
         chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'fillUser', data: user });
         });
      });
   });

   document.querySelectorAll('#contrasena').forEach(el => {
      el.addEventListener('click', () => {
         const pwd = el.textContent.trim();
         chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'fillPassword', data: pwd });
         });
      });
   });
}
function searchData() {
   document.querySelector('.search').addEventListener('input', function () {
      const searchQuery = this.value.toLowerCase();
      const tickets = document.querySelectorAll('.ticket');

      tickets.forEach(ticket => {
         const description = ticket.querySelector('.description').textContent.toLowerCase();
         const usuario = ticket.querySelector('#usuario').textContent.toLowerCase();
         const contrasena = ticket.querySelector('#contrasena').textContent.toLowerCase();

         if (description.includes(searchQuery) || usuario.includes(searchQuery) || contrasena.includes(searchQuery)) {
            ticket.style.display = 'block';
         } else {
            ticket.style.display = 'none';
         }
      });
   });
}
const btnCuentas = document.querySelector('.cuentas');
const showTickets = document.getElementById('tickets-container');
const search = document.querySelector('.search');
const icon = document.querySelector('.cuentas img');
const iconsearch = document.querySelector('.search+img');

btnCuentas.addEventListener('click', () => {
   if (showTickets.classList.contains('hidden')) {
      showTickets.classList.remove('hidden');
      search.style.display = 'block';
      iconsearch.style.display = 'block';
      icon.style.transform = 'rotate(180deg)';
      LoadDataT();
   } else {
      showTickets.classList.add('hidden');
      search.style.display = 'none';
      iconsearch.style.display = 'none';
      icon.style.transform = 'rotate(0deg)';
   }
});


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
   chrome.tabs.sendMessage(tabs[0].id, { action: "getEmail" }, function (response) {
      if (response && response.data) {
         document.getElementById('txtUsername').value = response.data;
      }
   });
});


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
   chrome.tabs.sendMessage(tabs[0].id, { action: "getPassword" }, function (response) {
      if (response && response.data) {
         document.getElementById('txtPassword').value = response.data;
      }
   });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
   chrome.tabs.sendMessage(tabs[0].id, { action: "getDescription" }, function (response) {
      if (response && response.data) {
         document.getElementById('txtDescri').value = response.data;
      }
   });
});


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
   chrome.tabs.sendMessage(tabs[0].id, { action: "savePassword" }, function (response) {
      if (response && response.data) {
         document.getElementById('txtPassword').value = response.data;
      }
   });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
   chrome.tabs.sendMessage(tabs[0].id, { action: "selectTextUser" }, function (response) {
      if (response && response.data) {
         document.getElementById('txtUsername').value = response.data;
      }
   });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
   chrome.tabs.sendMessage(tabs[0].id, { action: "selectTextPassword" }, function (response) {
      if (response && response.data) {
         document.getElementById('txtPassword').value = response.data;
      }
   });
});