frappe.ui.form.on("Ordering CT", {
	create_mr: function(frm, cdt, cdn){
	    var row = locals[cdt][cdn];
	    
	    var d = new frappe.ui.Dialog({
		            'title': 'MR REQUIREMENTS',
		            'fields': [
		                {
		                    'label': 'Item',
		                    'fieldname': 'item',
		                    'fieldtype': 'Link',
		                    'options': 'Item',
		                    'read_only': 1
		                },
		                {
		                    'label': 'Available Qty',
		                    'fieldname': 'qty',
		                    'fieldtype': 'Float',
		                    'read_only': 1
		                },
		                {
		                    'label': 'Reserved Qty',
		                    'fieldname': 'res_qty',
		                    'fieldtype': 'Float',
		                    'read_only': 1
		                },
		                {
		                    'label': 'Required Qty',
		                    'fieldname': 'req_qty',
		                    'fieldtype': 'Float',
		                    
		                },
		                
		                
		            ],
		            primary_action_label: 'Create MR',
		            primary_action: function (data) {
		                frappe.call({
							method: "fm_addons.events.ordering.create_mr",
							args:{
								"item_code": data.item,
								"qty": data.req_qty,
							},
							freeze: true,
							freeze_message: "MR is being created, please wait...",
							callback: (r) => {
								debugger;
								d.hide();

								frappe.msgprint(`MR Created : <a target="_blank" href="#Form/Material Request/`+r.message+`">`+r.message+`</a>`)
								

							}
						})


		            }
		        });

		        d.set_value("item", row.items)
				d.set_value("qty", 10)
				d.set_value("available_qty", 10)
				d.set_value("res_qty", 10)
				
				

				d.show();
	}



})