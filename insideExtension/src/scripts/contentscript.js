console.log("'Allo 'Allo! Content script", "Xenotime");
window.onload = function() {
  var re = /.com\/(\w{15})/g;
  var match = re.exec(window.location.href);

  if (match) {
    showApiName(match[1]);
  }
};
