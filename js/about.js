/* Quilldown: the "On this page" menu on /about (small screens) closes after you pick a section. */
(function () {
  'use strict';
  var menu = document.querySelector('.ab-outline-m');
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.open = false; });
})();
