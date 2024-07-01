const firebaseConfig = {
   databaseURL: "https://ctrlusuario-default-rtdb.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const newid = 0;
const tableData = document.querySelector("tbody");


//leo datos
function readData() {
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
             <td>${value.Usuario}</td>
             <td>${value.Contrasena}</td>
             <td>${value.Descripcion}</td>
   
      <td>
        
         <button id="btn-delete" class="btn-delete">Eliminar</button>
      </td>`;

      }

      tableData.innerHTML = htmlData;
   });
}


//guardo datos
function saveData(usuario, contra, descri) {
   _usuario = usuario;
   _contra = contra;
   _descri = descri;
   var listRef = database.ref("Cuentas/");

   // para generar un unico id
   var newRef = listRef.push();

   newRef.set({
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

//elimino datos
function deleteData(id) {
   var listRef = database.ref("Cuentas/" + id);
   listRef.remove();

}
