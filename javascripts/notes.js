$(function() {
  var adaptor = $.html5.supportsOffline() ? 'webkit' : 'gears'
  notes = new Notes(adaptor)

  notes.getNotes();    

  $('#noteSubmitter').click(function(event) {notes.save(); event.preventDefault();}); //clicking on the submit button creates a note
  $('#noteCreateForm').submit(function(event) {notes.save(); event.preventDefault();}); //pressing enter on the text input creates a note
  $('#newNote').click(function(event) {notes.editNew(); event.preventDefault();})
  
  if($.html5.supportsLocalStorage()) {
    //do something
  } else {
    $('body').append("How tragic!  I do not support local storage!")
  }
});

var Notes = function(adaptor) {
  this.init(adaptor)
}

Notes.prototype = {
  
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
  
  onNoteGet: function(note, notes_list) {
    var li = $("li[key='" + note.key+ "']")
    if(li.length > 0) {
      $('.title', li).html(note.title)
    } else {
      li = $("<li key="+ note.key + "><span class='title'>"+ note.title + "</span><span class='edit_links'><a href='#' class='note_edit_link'>edit</a>&nbsp;<a href='#' class='note_delete_link'>delete</a></span></li>")
      $('.note_edit_link', li).click(function(event) {notes.edit(note.key); event.preventDefault();})
      $('.note_delete_link', li).click(function(event) {notes.destroy(li, note.key); event.preventDefault();})
      notes_list.append(li)
    }
    
  },
  
  edit: function(key) {
    that = this
    var note = this.notesDB.get(key, function(note) {that.onNoteEdit(note)})
  },
  
  onNoteEdit: function(note) {
    $('#noteKey').val(note.key)
    logger('editing note ' + note.key)
    $('#titleText').val(note.title).focus().select()
    $('#bodyText').val(note.text)
  },

  save:function() {
    var title = $('#titleText').val();
    var text = $('#bodyText').val();
    var key = $('#noteKey').val();
    if (key == '') {
      key = null
    }
    logger("saving note " + title)
    logger(" key = " + key)
    that = this
    this.notesDB.save({key: key, title: title, text: text}, function(note) {that.onNoteSave(note, that.notes_list)})
  },
  
  onNoteSave: function(note, notes_list) {
    logger("the new note has a title of " + note.title + " and a key of " + note.key)
    this.onNoteGet(note, this.notes_list)
  },
  
  destroy:function(li, key) {
    logger("removing note with key = " + key)
    that = this
    this.notesDB.remove(key, function(note) {that.onNoteDestroy(li, key)})
  },
  
  onNoteDestroy: function(li, key) {
    logger("I just deleted a note with key = " + key)
    li.remove()
    this.editNew()
  },
  
  editNew: function() {
    $('#noteKey').val('')
    $('#titleText').val('').focus().select()
    $('#bodyText').val('')
  },

  getNotes:function(notes_list) {
    logger("getting notes")
    that = this
    this.notesDB.each(function(note) {that.onNoteGet(note, that.notes_list)})
  }

}

function logger(text) {
  if (!!window.console && !!window.console.log) {
    console.log(text)
  } else {
    $("#logger").append(text + "<br/>")
  }
  
}