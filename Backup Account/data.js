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

const tableData = document.querySelector("tbody");
const cuerpo = document.getElementById('dgvDatos');

function LoadData() {


   const database = firebase.database();
   const fetchData = database.ref('Cuentas/');

   fetchData.on('value', (snapshot) => {
      const data = snapshot.val();
      var htmlData = '';


      for (var key in data) {
         var value = data[key];


         htmlData += `
         <tr>
             <td style="display:none">${key}</td>
             <td>${value.Id}</td>
             <td title="Doble click para autocompletar">${value.Usuario}</td>
             <td title="Doble click para autocompletar">${value.Contrasena}</td>
             <td>${value.Descripcion}</td>
   
      <td>
        
         <button id="btn-delete" class="btn-delete">Eliminar</button>
      </td>`;

      }

      tableData.innerHTML = htmlData;
   });
}
function deleteData() {
   const database = firebase.database();

   const tabla = document.getElementById('dgvDatos');
   tabla.addEventListener('click', function (e) {
      e.preventDefault();
      if (e.target && e.target.classList.contains('btn-delete')) {
         const fila = e.target.closest('tr');
         const id = fila.querySelector('td:first-child').textContent.trim();

         const mensaje = confirm("¿Desea eliminar este registro?");
         if (mensaje) {
            var listRef = database.ref("Cuentas/" + id);
            listRef.remove();

            window.location.reload();
         }
      }
   });
}


function SearchData() {
   const txtBuscar = document.getElementById("txtBuscar");
   txtBuscar.addEventListener("input", function () {
      const inputStr = txtBuscar.value.toUpperCase();

      document.querySelectorAll('#dgvDatos tr').forEach((tr, index) => {
         if (index === 0) return;
         const anyMatch = [...tr.children].some(td => td.textContent.toUpperCase().includes(inputStr));

         if (anyMatch) tr.style.removeProperty('display');
         else tr.style.display = 'none';
      });
   });
}


function ExportData() {
   const btnExportar = document.querySelector('#btnExportar');
   btnExportar.addEventListener('click', () => {
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
      a.remove();
   });
}





window.addEventListener('load', () => {
   LoadData();
   SearchData();
   ExportData();
   deleteData();

});



