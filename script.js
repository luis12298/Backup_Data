

document.addEventListener('DOMContentLoaded', () => {
   const btn = document.querySelector('#btnGuardar');
   const txtUsername = document.querySelector('#txtUsername');
   const txtPassword = document.querySelector('#txtPassword');
   const txtDescri = document.querySelector('#txtDescri');
   const popup = document.querySelector('#popup_datos');

   txtUsername.value = localStorage.getItem('username') || '';
   txtPassword.value = localStorage.getItem('password') || '';
   txtDescri.value = localStorage.getItem('descri') || '';

   txtUsername.addEventListener('input', function () {
      localStorage.setItem('username', txtUsername.value);
   });

   txtPassword.addEventListener('input', function () {
      localStorage.setItem('password', txtPassword.value);
   });
   txtDescri.addEventListener('input', function () {
      localStorage.setItem('descri', txtDescri.value);
   });




   btn.addEventListener('click', () => {
      const username = localStorage.getItem('username') || '';
      const password = localStorage.getItem('password') || '';
      const descri = localStorage.getItem('descri') || '';

      if (username === '' || password === '' || descri === '') {
         alert('Por favor, rellene todos los campos para poder guardar los datos');
         return;
      }

      saveData(username, password, descri);
      //limpiar
      txtUsername.value = '';
      txtPassword.value = '';
      txtDescri.value = '';

      localStorage.clear();
   });

   window.addEventListener('beforeunload', function () {
      localStorage.clear();
   });

   popup.addEventListener('click', function (event) {
      event.preventDefault();
      var width = 720;
      var height = 400;
      var left = (window.innerWidth - width) / 2;
      var top = (window.innerHeight - height) / 2;
      var options = 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;

      window.open('datos.html', 'Datos', options);

   });

});


readData();

var tabla = document.getElementById('dgvDatos');
tabla.addEventListener('click', function (e) {
   e.preventDefault();
   if (e.target && e.target.classList.contains('btn-delete')) {
      var fila = e.target.closest('tr');

      var id = fila.querySelector('td:first-child').textContent.trim();

      var mensaje = confirm("¿Desea eliminar este registro?");
      if (mensaje) {
         deleteData(id);
         var ventana = window.self;
         ventana.opener = window.self;
         window.opener.location.reload();
      }
   }
});

//Buscar
const txtBuscar = document.getElementById("txtBuscar");
const tbody = document.querySelector("#dgvDatos tbody");

txtBuscar.addEventListener("input", function () {
   const value = txtBuscar.value.toLowerCase();
   const rows = tbody.getElementsByTagName("tr");

   Array.prototype.forEach.call(rows, function (row) {
      var rowText = row.textContent.toLowerCase();
      if (rowText.indexOf(value) > -1) {
         row.style.display = "";
      } else {
         row.style.display = "none";
      }
   });
});

const btn = document.querySelector('#btnExportar');

btn.addEventListener('click', () => {
   const table = document.querySelector('#dgvDatos');
   const rows = Array.from(table.rows);
   const csvContent = rows.map(row => {
      const cells = Array.from(row.cells);
      cells.pop();
      return cells.map(cell => cell.innerText).join(',');
   }).join('\n');
   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
   const a = document.createElement('a');
   a.href = URL.createObjectURL(blob);
   a.download = 'table-data.csv';
   a.click();
   a.removeChild(a);

});