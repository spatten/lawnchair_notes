$(function() {
  $('#noteSubmitter').click(function(event) {submitNote(); event.preventDefault();}); //clicking on the submit button creates a note
  $('#noteCreateForm').submit(function(event) {submitNote(); event.preventDefault();}); //pressing enter on the text input creates a note
  setupDatabase();
  getNotes();
});

function setupDatabase() {
  notesDB = openDatabase("notes", "", "The Example Notes App!", 1048576);
  notesDB.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Notes(title TEXT, body TEXT)', [], nullDataHandler, errorHandler);
  })
  
}

function nullDataHandler(tx, results) {
  //no-op
}

function errorHandler(tx, results) {
  alert("Error!")
}

function submitNote() {
  notesDB.transaction(function(tx) {
    var title = $('#titleText').val();
    var text = $('#bodyText').val();  
    logger("writing " + title + "," + text + " to Notes")    
    tx.executeSql('INSERT INTO Notes VALUES(?, ?)', [title, text], getNotes);
  })
}

function getNotes() {
  notesDB.transaction(function(tx) {
    tx.executeSql('SELECT * from NOTES', [], notesSelectHandler, errorHandler)
  })
}

function notesSelectHandler(tx, results) {
  var html = "<ul>"
  for(var i=0; i < results.rows.length; i++) {
    var row = results.rows.item(i);
    html += "<li>"+ row['title']+ ": " + row['body'] +"</li>"    
  }
  html += "</ul>"
  $('#notesList').html(html)
}

function logger(text) {
  $("#logger").html(text)
}