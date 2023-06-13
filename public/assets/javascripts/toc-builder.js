$(document).ready(function() {
$(".tocSeries").each(function(){
  var testme = $(this).data("id");
  $("ul.toc").append('<li>' + testme + '</li>');
	});
});
