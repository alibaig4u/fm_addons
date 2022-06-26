# -*- coding: utf-8 -*-
# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import nowdate


@frappe.whitelist()
def create_mr(item_code, qty):
	mr = frappe.new_doc('Material Request')
	mr.company = "Faizy.com"
	mr.schedule_date = nowdate()
	mr.transaction_date = nowdate()
	mr.append('items',{
		"item_code":item_code
		"qty": qty
		})
	mr.save(ignore_permissions=True)
	mr.submit()