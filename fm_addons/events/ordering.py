# -*- coding: utf-8 -*-
# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import nowdate


@frappe.whitelist()
def create_mr(item_code, qty):
	try:
		mr = frappe.new_doc('Material Request')
		mr.company = "Faizy.com"
		mr.schedule_date = nowdate()
		mr.transaction_date = nowdate()
		mr.warehouse = "Store - F"
		mr.append('items',{
			"item_code":item_code,
			"qty": qty
			})
		mr.save(ignore_permissions=True)
		mr.submit()
		return mr.name
	except Exception as ex:
		frappe.log_error(frappe.get_traceback())