document.addEventListener('click', function (e) {
   if (e.target.tagName === 'TH') {
      var th = e.target;
      var table = th.closest('table');
      var index = Array.prototype.indexOf.call(th.parentNode.children, th);
      var asc = th.asc = !th.asc;
      var rows = Array.from(table.querySelectorAll('tr:nth-child(n+2)'));
      rows.sort(comparer(index, asc));
      var tbody = table.querySelector('tbody');
      rows.forEach(row => tbody.appendChild(row));
   }
});

function comparer(index, asc) {
   return function (a, b) {
      var valA = getCellValue(a, index);
      var valB = getCellValue(b, index);
      if (index === 2) { // Assuming the date column is at index 2
         valA = reformatDate(valA);
         valB = reformatDate(valB);
      }
      if (!isNaN(valA) && !isNaN(valB)) {
         return asc ? valA - valB : valB - valA;
      } else {
         return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
   };
}

function getCellValue(row, index) {
   return row.children[index].textContent.trim();
}

function reformatDate(val) {
   return val.substring(6, 10) + val.substring(3, 5) + val.substring(0, 2);
}
