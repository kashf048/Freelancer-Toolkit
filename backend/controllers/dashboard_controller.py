from flask import current_app, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime, timedelta

def get_client_collection():
    return current_app.db.clients

def get_project_collection():
    return current_app.db.projects

def get_invoice_collection():
    return current_app.db.invoices

@jwt_required()
def get_dashboard_summary():
    user_id = get_jwt_identity()
    
    try:
        # 1. Total Clients
        total_clients = get_client_collection().count_documents({"user_id": ObjectId(user_id)})
        
        # 2. Total Projects
        total_projects = get_project_collection().count_documents({"user_id": ObjectId(user_id)})
        
        # 3. Invoice Status Counts
        pipeline = [
            {"$match": {"user_id": ObjectId(user_id)}},
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        invoice_status_counts = list(get_invoice_collection().aggregate(pipeline))
        
        status_summary = {
            "Paid": 0,
            "Sent": 0,
            "Draft": 0,
            "Overdue": 0,
            "Viewed": 0
        }
        for item in invoice_status_counts:
            if item['_id'] in status_summary:
                status_summary[item['_id']] = item['count']
        
        # 4. Revenue Chart Data (Last 90 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=90)
        
        revenue_pipeline = [
            {"$match": {
                "user_id": ObjectId(user_id),
                "status": "Paid",
                "updated_at": {"$gte": start_date}
            }},
            {"$group": {
                "_id": {
                    "$dateToString": {"format": "%Y-%m-%d", "date": "$updated_at"}
                },
                "total_revenue": {"$sum": "$total_amount"}
            }},
            {"$sort": {"_id": 1}}
        ]
        revenue_data = list(get_invoice_collection().aggregate(revenue_pipeline))
        
        # Format for frontend chart (e.g., array of {date: "YYYY-MM-DD", revenue: 123.45})
        chart_data = [{"date": item['_id'], "revenue": item['total_revenue']} for item in revenue_data]
        
        return jsonify({
            "total_clients": total_clients,
            "total_projects": total_projects,
            "invoice_summary": status_summary,
            "revenue_chart_data": chart_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching dashboard summary: {e}")
        return jsonify({"message": "Error fetching dashboard data"}), 500
