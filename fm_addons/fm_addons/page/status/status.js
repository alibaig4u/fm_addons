frappe.pages['status'].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Status',
		single_column: true
	});

	page.main.html(frappe.render_template("status", { 'doc': {} }));
	

	frappe.si_list.make(wrapper, wrapper.page);
	frappe.si_list.so = ""
}



frappe.si_list = {

	make: function (wrapper, page) {
		setTimeout(() => {
			frappe.si_list.renderFilters(wrapper, page);
			// frappe.si_list.orderdate_control.set_value([frappe.datetime.month_start(), frappe.datetime.now_date()]);
			frappe.si_list.renderChart()
		}, 100);

		var me = frappe.si_list;
		me.page = page;


		frappe.si_list.table = $('#datatable');
		frappe.si_list.item_table = $('#item_datatable');
		
		setTimeout(() => {
			frappe.si_list.buildTable(frappe.si_list.table, 8, 1, false)
			frappe.si_list.buildTable(frappe.si_list.item_table, 8, 1, true)
		}, 100);

		
	},

	renderFilters: function(wrapper, page){

		frappe.si_list.order_control = frappe.ui.form.make_control({
			df: {
				label: __("Sales Order No"),
				fieldtype: 'Link',
				placeholder: __("Select Order No"),
				options: 'Sales Order',
				change: function () {
					//todo
					$("#filter_btn").trigger("click");
				}
			},
			parent: $('.sales_order_control'),
			render_input: true,
		});

		frappe.si_list.company_control = frappe.ui.form.make_control({
			df: {
				label: __("Company"),
				fieldtype: 'Link',
				placeholder: __("Select Company"),
				options: 'Company',
				change: function () {
					//todo
					$("#filter_btn").trigger("click");
				}
			},
			parent: $('.company_control'),
			render_input: true,
		});

		frappe.si_list.project_control = frappe.ui.form.make_control({
			df: {
				label: __("Project"),
				fieldtype: 'Link',
				placeholder: __("Select Project"),
				options: 'Project',
				change: function () {
					//todo
					$("#filter_btn").trigger("click");
				}
			},
			parent: $('.project_control'),
			render_input: true,
		});

		page.main.on("click", "#filter_btn", function () {

			// $('#item_data').html('<tr><td colspan="3" style=" text-align: center; font-weight: 500; ">NO DATA</td></tr>')
			$('#document_status').html(`<tr>
											<td>Shop Drawing</td>
											<td> 0 % </td>
										</tr>
										<tr>
											<td>Ordering</td>
											<td> 0 % </td>
										</tr>
										<tr>
											<td>Manufacturing</td>
											<td> 0 % </td>
										</tr>
										<tr>
											<td>Delivery Note</td>
											<td> 0 % </td>
										</tr>
								`);
			frappe.si_list.item_table.bootstrapTable('load', []);
			frappe.si_list.table.bootstrapTable('load', frappe.si_list.setSOList(1, 10));
		})

	},
	buildTable: function ($el, cells, rows, is_item_table) {
		var i; var j; var row
		var columns = []
		var data = []
		debugger;
		var options = $el.bootstrapTable('getOptions')
		if(!is_item_table){
			data = frappe.si_list.setSOList(1, 10)
		}

		$el.bootstrapTable({
			columns: columns,
			data: data,
			onClickRow: function(row, $element, field){
				debugger;
				if(!is_item_table){
					frappe.si_list.so = row.order_no
					// var item_html = ''
					// $.each(row.items, function(k,v){
					// 	item_html += `<tr>
					// 		<td>`+v.item_name+`</td>
					// 		<td>`+v.description+`</td>
					// 		<td>`+v.qty+`</td>
					// 	</tr>`
					// })
					// $('#item_data').html(item_html)
					let item_data = []
					$.each(row.items, (k, v) => {
						item_data.push({
							"item_desc": v.description,
							"item_qty": v.qty
						})
					})

					frappe.si_list.item_table.bootstrapTable('load', item_data);


					var sd_status = !is_null(row.sd_status) ? row.sd_status : 0; 
					var ordering_status = !is_null(row.ordering_status) ? row.ordering_status : 0; 
					var manufacturing_status = !is_null(row.manufacturing_status) ? row.manufacturing_status : 0; 
					var delivery_status = !is_null(row.delivery_status) ? row.delivery_status : 0;
					$('#document_status').html(`<tr class='document_row' data-so='`+row.order_no+`' data-docname = '`+row.sd_name+`'   data-doc='Shop Drawing'>
													<td>Shop Drawing</td>
													<td> `+sd_status+` % </td>
												</tr>
												<tr class='document_row' data-so='`+row.order_no+`' data-docname = '`+row.ordering_name+`' data-doc='Ordering'>
													<td>Ordering</td>
													<td> `+ordering_status+` % </td>
												</tr>
												<tr class='document_row' data-so='`+row.order_no+`' data-docname = '`+row.manufacturing_name+`' data-doc='Manufacturing'>
													<td>Manufacturing</td>
													<td> `+manufacturing_status+` % </td>
												</tr>
												<tr class='document_row' data-so='`+row.order_no+`' data-docname = '`+row.delivery_name+`' data-doc='Delivery Note'>
													<td>Delivery Note</td>
													<td> `+delivery_status+` % </td>
												</tr>
												
												
					`)
					frappe.si_list.refreshChartData([delivery_status, manufacturing_status, ordering_status, sd_status]);

					$('.document_row').on('click', function(e){
						debugger;
						var so_doc = $(this).data('so');
						var doctype = $(this).data('doc');
						var docname = $(this).data('docname');
						if(typeof(so_doc) != 'undefined'){
							
							if(['Manufacturing', 'Shop Drawing'].includes(doctype)){
								if (!is_null(docname) && docname != ''){
									
									frappe.set_route('Form', doctype, docname)
								}
								else{
									
									frappe.new_doc(doctype, {"sale_order": so_doc})
								}

								
							}
							else if(doctype == 'Delivery Note'){
								if (!is_null(docname) && docname != ''){
									
									frappe.set_route('Form', doctype, docname)
								}
								else{
									frappe.new_doc(doctype, {"sales_order": so_doc})
								}
								
							}
							else{
								if (!is_null(docname) && docname != ''){
									frappe.set_route('Form', doctype, docname)
								}else{
									frappe.new_doc(doctype, {"sales_order": so_doc})
								}
							}
							
							
						}
					
						
					})
				}

			}
		})
	},
	
	setSOList: function (number, size) {
		
		let item_data = []
		frappe.call({
			method: "fm_addons.fm_addons.page.status.status.get_so",
			args:{
				offset: (number - 1) * size,
				limit: size,
				filters: {
					orderno: frappe.si_list.order_control.get_value() != "" ? frappe.si_list.order_control.get_value() : null,
					company: frappe.si_list.company_control.get_value() != "" ? frappe.si_list.company_control.get_value() : null,
					project: frappe.si_list.project_control.get_value() != "" ? frappe.si_list.project_control.get_value() : null,
				}
			},

			async:false,
			callback: (r) => {

				$.each(r.message, (k, v) => {
					item_data.push({
						"order_no": v.sales_order,
						"customer": v.customer,
						"project_name": v.project,
						"status_percent": (v.manufacturing_status+v.ordering_status+v.sd_status+v.delivery_status)/4,
						"manufacturing_status": v.manufacturing_status,
						"ordering_status": v.ordering_status,
						"delivery_status":v.delivery_status,
						"sd_status": v.sd_status,
						"items": v.items,
						"manufacturing_name": v.manufacturing_name,
						"ordering_name": v.ordering_name,
						"sd_name":v.sd_name,
						"delivery_name":v.delivery_name,	
					})
				})

			}
		})
		return item_data


	},
	renderChart: function(){
		debugger;
		var dom = document.getElementById('echart_status');
		frappe.si_list.myChart = echarts.init(dom)
		var option = {
			yAxis: {
				type: 'category',
				data: ['Delivery Note', 'Manufacturing', 'Ordering', 'Shop Drawing']
				
			},
			xAxis: {
				type: 'value'
			},
			series: [
				{
				data: [0, 0, 0, 0],
				type: 'bar'
				}
			]
		};
		frappe.si_list.myChart.setOption(option);
	  

		window.addEventListener('resize', frappe.si_list.myChart.resize);
	},
	refreshChartData: function(chartdata){
		var dataset = chartdata
		var options = {
			yAxis: {
				type: 'category',
				data: ['Delivery Note', 'Manufacturing', 'Ordering', 'Shop Drawing']
			},
			xAxis: {
				type: 'value'
			},
			series: [
				{
				data: dataset,
				type: 'bar'
				}
			]
		}
		frappe.si_list.myChart.setOption(options)


	}
	
}
