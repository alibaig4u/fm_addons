# Copyright (c) 2013, Mohammad Ali and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

def execute(filters=None):
	columns = get_columns(filters)
	data = get_data(filters)
	return columns, data

def get_columns(filters):
	columns = [
		{
			"label": _("Pay Type"),
			"fieldname": "pay_type",
			"fieldtype": "Data",
			"width": 140,
		},
		{
			"label": _("Date"),
			"fieldname": "date",
			"fieldtype": "Date",
			"width": 140,
		},
		{
			"label": _("Party Type"),
			"fieldname": "party_type",
			"fieldtype": "Data",
			"width": 140,
		},
		{
			"label": _("Party"),
			"fieldname": "party",
			"fieldtype": "Data",
			"width": 140,
		},
		{
			"label": _("Amount"),
			"fieldname": "amount",
			"fieldtype": "Currency",
			"width": 140,
		},
		{
			"label": _("Difference"),
			"fieldname": "difference",
			"fieldtype": "Currency",
			"width": 140,
		},
		
		
	]

	return columns

def get_conditions(filters=None):
	conditions = ""
	# if filters.get('company') is not None:
	# 	conditions += "tss.company = '{}' and ".format(filters.get('company'))
	conditions += "tpe.payment_type in ('Receive', 'Pay') and "
	
	if filters.get('date') is not None:
		conditions += "tpe.clearance_date between '{}' and '{}' and ".format(filters.get('date')[0], filters.get('date')[1])
	conditions = conditions.strip("and ")
	if conditions != "":
		conditions = "where " + conditions
	return conditions

def get_data(filters):
	conditions = get_conditions(filters)
	data =[]
	sql = frappe.db.sql(
			"""
		SELECT 
				payment_type,
				party_type,
				party,
				sum(paid_amount) as paid_amount,
				clearance_date
		FROM  
		  		`tabPayment Entry` tpe
				{}
		group by 
		   		tpe.payment_type
				""".format(conditions),as_dict=True
		)

	payment_type = ""
	total_paid_amount = 0
	g_total_paid_amount = 0
	receive_amount = 0
	pay_amount = 0
	for l in sql:
		if payment_type == "":
			data.append({
				'pay_type':l.payment_type,
				'date':l.clearance_date,
				'party_type':l.party_type,
				'party':l.party,
				'amount':l.paid_amount,
			})
			payment_type=l.payment_type
			total_paid_amount += l.paid_amount
			g_total_paid_amount += l.paid_amount
			if l.payment_type == 'Receive':
				receive_amount += l.paid_amount
			else:
				pay_amount += l.paid_amount

		elif payment_type != l.payment_type:
			data.append({
				'party':"<b>TOTAL</b>",
				'amount': total_paid_amount,
			})
			total_paid_amount = 0
			
			data.append({
					'pay_type':l.payment_type,
					'date':l.clearance_date,
					'party_type':l.party_type,
					'party':l.party,
					'amount':l.paid_amount,
			})
			payment_type=l.payment_type
			total_paid_amount += l.paid_amount
			g_total_paid_amount += l.paid_amount

			if l.payment_type == 'Receive':
				receive_amount += l.paid_amount
			else:
				pay_amount += l.paid_amount

		else:
			data.append({
					'pay_type':l.payment_type,
					'date':l.clearance_date,
					'party_type':l.party_type,
					'party':l.party,
					'amount':l.paid_amount,
			})
			total_paid_amount += l.paid_amount
			g_total_paid_amount += l.paid_amount

			if l.payment_type == 'Receive':
				receive_amount += l.paid_amount
			else:
				pay_amount += l.paid_amount

	data.append({
				'party':"<b>TOTAL</b>",
				'amount': total_paid_amount,
			})
	data.append({
				'party':"<b>GRAND TOTAL</b>",
				'amount': g_total_paid_amount,
				'difference': receive_amount-pay_amount,
			})
	return data


