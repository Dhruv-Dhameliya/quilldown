/* Quilldown — the small "what the Network tab shows" illustration on /privacy.
   It only counts characters; nothing you type here is stored or sent. */
(function () {
  'use strict';
  var ta = document.getElementById('pvText'), n = document.getElementById('pvChars');
  if (!ta || !n) return;
  ta.addEventListener('input', function () { n.textContent = String(ta.value.length); });
})();
