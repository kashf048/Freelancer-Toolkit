from flask import Blueprint
from controllers.project_controller import (
    create_project, 
    get_all_projects, 
    get_project_detail, 
    update_project, 
    delete_project,
    create_milestone,
    update_milestone,
    delete_milestone
)

project_bp = Blueprint('projects', __name__)

# Project CRUD Routes
project_bp.route('/', methods=['POST'])(create_project)
project_bp.route('/', methods=['GET'])(get_all_projects)
project_bp.route('/<project_id>', methods=['GET'])(get_project_detail)
project_bp.route('/<project_id>', methods=['PUT'])(update_project)
project_bp.route('/<project_id>', methods=['DELETE'])(delete_project)

# Milestone CRUD Routes (nested under project)
project_bp.route('/<project_id>/milestones', methods=['POST'])(create_milestone)
project_bp.route('/<project_id>/milestones/<milestone_id>', methods=['PUT'])(update_milestone)
project_bp.route('/<project_id>/milestones/<milestone_id>', methods=['DELETE'])(delete_milestone)
