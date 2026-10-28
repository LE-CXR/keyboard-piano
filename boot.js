
try {
  var _t = localStorage.getItem('kpiano.v1.theme');
  if (['light','dark','sakura','ocean','galaxy'].indexOf(_t) >= 0) document.documentElement.dataset.theme = _t;
} catch (e) {}
