// Copyright (c) 2016, Mohammad Ali and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Payments Update"] = {
	"filters": [
		{
			fieldname: "date",
			label: __("Clearance Date"),
			fieldtype: "DateRange",
			default: [frappe.datetime.month_start(), frappe.datetime.now_date()],
		},
	]
};
