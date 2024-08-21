chrome.runtime.onInstalled.addListener(function () {
   chrome.contextMenus.create({
      id: 'addUser',
      title: 'Añadir Usuario',
      contexts: ['selection']
   });

   chrome.contextMenus.create({
      id: 'addPassword',
      title: 'Añadir Contraseña',
      contexts: ['selection']
   });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
   if (info.menuItemId === 'addUser' || info.menuItemId === 'addPassword') {
      chrome.tabs.sendMessage(tab.id, {
         action: "textSelect",
         menuItemId: info.menuItemId,
         selectedText: info.selectionText
      });
   }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === 'openExtension') {
      // Intenta abrir el popup (solo funciona en algunos contextos)
      chrome.action.openPopup().catch(error => {
         console.log('No se pudo abrir el popup:', error);

         // Si no se puede abrir el popup, intenta abrir la página de opciones
         chrome.runtime.openOptionsPage(error => {
            if (chrome.runtime.lastError) {
               console.error('No se pudo abrir la página de opciones:', chrome.runtime.lastError);
            }
         });
      });
   }
});
// function detectPasswordFields(tabId) {
//    chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       files: ['content.js'] // Carga un script separado para el contenido
//    });
// }