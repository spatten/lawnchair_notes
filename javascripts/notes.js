$(function() {
  var adaptor = $.html5.supportsOffline() ? 'webkit' : 'gears'
  note = new Note(adaptor)

  note.getNotes();    

  $('#noteSubmitter').click(function(event) {note.submitNote(); event.preventDefault();}); //clicking on the submit button creates a note
  $('#noteCreateForm').submit(function(event) {note.submitNote(); event.preventDefault();}); //pressing enter on the text input creates a note

  
  if($.html5.supportsLocalStorage()) {
    //do something
  } else {
    $('body').append("How tragic!  I do not support local storage!")
  }
});

var Note = function(adaptor) {
  this.init(adaptor)
}

Note.onNoteSelect = function(note, notes_list) {
  logger("adding to notes list: " + note.title)
  notes_list.append("<li>"+ note.title + ": " + note.text +"</li>"    )
}

Note.onNoteSave = function(note, notes_list) {
  logger("the new note has a title of " + note.title + " and a key of " + note.key)
  Note.onNoteSelect(note, notes_list)
}

Note.prototype = {
  
  init:function(adaptor) {
    this.adaptor = adaptor
    this.notes_list = $('#notesList > ul')
    this.setupDatabase()
  },
  
  setupDatabase:function() {
    logger("getting DB")
    this.notesDB = new Lawnchair({table: 'notes', adaptor: this.adaptor})
    this.versionDB = new Lawnchair({table: 'version', adaptor: this.adaptor})
  },

  submitNote:function() {
    var title = $('#titleText').val();
    var text = $('#bodyText').val();
    logger("saving note " + title) 
    that = this
    this.notesDB.save({title: title, text: text}, function(note) {Note.onNoteSave(note, that.notes_list)})
  },

  getNotes:function(notes_list) {
    logger("getting notes")
    that = this
    this.notesDB.each(function(note) {Note.onNoteSelect(note, that.notes_list)})
  },

}

function logger(text) {
  if (!!window.console && !!window.console.log) {
    console.log(text)
  } else {
    $("#logger").append(text)
  }
  
}