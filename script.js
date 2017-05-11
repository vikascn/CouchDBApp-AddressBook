db = $.couch.db("addressbook");

function displayContacts(){
	$('#contacts').empty();

	db.view("addressbook/contacts", {
		success: function(data){
			var i;
			var contact;
			var first_name;
			var last_name;
			var street_address;
			var city;
			var state;
			var zip;
			var phone;
			var listitem;

			console.log("Fetching Contacts...");

			for(i in data.rows){
				contact  		= data.rows[i].value;
				id       		= contact._id;
				first_name 		= contact.first_name;
				last_name 		= contact.last_name;
				street_address 	= contact.street_address;
				city 			= contact.city;
				state 			= contact.state;
				zip 			= contact.zip;
				phone 			= contact.phone;

				listitem = '<ul><li>' +
							'<h2>'+ first_name + ' ' + last_name + '</h2>' +
							'<p>'+ street_address +'</p>' +
							'<p>'+ city +', '+ state + ' '+ zip + '</p>' +
							'<p>'+ phone +'</p>' +
							'<p><a href="#" id="'+ id +'" class="edit">Edit</a> | <a href="#" id="'+ id +'" class="remove">Remove</a></p></li>';
			
				$('#contacts').append(listitem);
			}
		}
	})
}

function showContactForm(doc){
	var formhtml;
	formhtml = '<form name="update" id="update" class="well" action="">';
	formhtml = formhtml + '<h3>Add Contact</h3>';
	if(doc){
		formhtml = formhtml + '<input name="docid" id="docid" type="hidden" value="' + doc._id + '"/>';
	}
	formhtml = formhtml + 
	'<div class="form-group">';
	formhtml = formhtml + 
	'<label>First Name</label>' +
	'<input type="text" name="first_name" class="form-control" id="first_name" value="'+(doc ? doc.first_name : '')+'"/>';
	formhtml = formhtml + 
	'</div>';
	formhtml = formhtml + 
	'<div class="form-group">';
	formhtml = formhtml + 
	'<label>Last Name</label>' +
	'<input type="text" name="last_name" class="form-control" id="last_name" value="'+(doc ? doc.last_name : '')+'"/>';
	formhtml = formhtml + 
	'</div>';
	formhtml = formhtml + 
	'<div class="form-group">';
	formhtml = formhtml + 
	'<label>Street Address</label>' +
	'<input type="text" name="street_address" class="form-control" id="street_address" value="'+(doc ? doc.street_address : '')+'"/>';
	formhtml = formhtml + 
	'</div>';
	formhtml = formhtml + 
	'<div class="form-group">';
	formhtml = formhtml + 
	'<label>City</label>' +
	'<input type="text" name="city" class="form-control" id="city" value="'+(doc ? doc.city : '')+'"/>';
	formhtml = formhtml + 
	'</div>';
	formhtml = formhtml + 
	'<div class="form-group">';
	formhtml = formhtml + 
	'<label>State</label>' +
	'<input type="text" name="state" class="form-control" id="state" value="'+(doc ? doc.state : '')+'"/>';
	formhtml = formhtml + 
	'</div>';
	formhtml = formhtml + 
	'<div class="form-group">';
	formhtml = formhtml + 
	'<label>Zip</label>' +
	'<input type="text" name="zip" id="zip" class="form-control" value="'+(doc ? doc.zip : '')+'"/>';
	formhtml = formhtml + 
	'</div>';
	formhtml = formhtml + 
	'<div class="form-group">';
	formhtml = formhtml + 
	'<label>Phone</label>' +
	'<input type="text" name="phone" class="form-control" id="phone" value="'+(doc ? doc.phone: '')+'"/>';
	formhtml = formhtml + 
	'</div>';
	formhtml = formhtml + '<input type="submit" name="submit" class="form-control update btn btn-primary" value="'+(doc ? 'Update' : 'Add')+'"';
	formhtml = formhtml + '</form>';

	$('#contactform').empty();
	$('#contactform').append(formhtml);
}

function buildDocument(doc, form){
	if(!doc){
		doc = new Object;
	}
	doc.first_name = form.find("input#first_name").val();
	doc.last_name = form.find("input#last_name").val();
	doc.street_address = form.find("input#street_address").val();
	doc.city = form.find("input#city").val();
	doc.state = form.find("input#state").val();
	doc.zip = form.find("input#zip").val();
	doc.phone = form.find("input#phone").val();
	return(doc);
}

$(document).ready(function(){
	displayContacts();

	$('#contacts').click(function(event){
		var target = $(event.target);
		if(target.is('a')){
			id = target.attr("id");

			if (target.hasClass("edit")) {
              db.openDoc(id, { success: function(doc) { 
                  showContactForm(doc);
              }});
            }

            if(target.hasClass("remove")){
            	check = confirm("Click OK To Continue");
            	if(check){
            		db.openDoc(id, { success: function(doc) { 
                  	db.removeDoc(doc, {
                  		success: function(){
                  			$('form#update').remove();
                  			displayContacts();
                  		}
                  	});
              }});
            	} else {
            		$('form#update').remove();
                    displayContacts();
            	}
            }
		}
	});

	$('.add-btn').on('click', function(){
		showContactForm();
	});

	$(document).on("click", "input.update", function(event){
		var form = $(event.target).parents("form#update");

		var id = form.find("input#docid").val();

		if(id){
			db.openDoc(id, {
				success: function(doc){
					db.saveDoc(buildDocument(doc, form), {
						success: function(){
							$("form#update").remove();
							displayContacts();
						}
					});
				}
			});
		} else {
			db.saveDoc(buildDocument(null, form),{
				success: function(){
					$("form#update").remove();
					displayContacts();
				}
			});
		}
	});
});