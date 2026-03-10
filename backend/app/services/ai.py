import os
import re
import json
from datetime import datetime, timedelta

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

class AIService:
    _model = None
    
    @staticmethod
    def _get_model():
        if not GEMINI_AVAILABLE:
            return None
        if AIService._model is None:
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                genai.configure(api_key=api_key)
                AIService._model = genai.GenerativeModel('gemini-2.0-flash')
        return AIService._model
    
    @staticmethod
    def parse_natural_language(text, project_context=None):
        model = AIService._get_model()
        if not model:
            return AIService._fallback_parse(text)
        
        team_members = project_context.get('team_members', []) if project_context else []
        member_names = [m.get('name', '') for m in team_members]
        
        prompt = f"""Parse this task description and extract structured data.
Text: "{text}"

Team members: {', '.join(member_names) if member_names else 'None specified'}

Return a JSON object with:
- title: string (main task title)
- description: string (additional details)
- assignees: array of names mentioned
- due_date: ISO date string if mentioned (interpret "tomorrow", "next week", etc.)
- priority: "low", "medium", "high", or "critical" based on urgency words

Only return valid JSON, no other text."""

        try:
            response = model.generate_content(prompt)
            result = json.loads(response.text.strip())
            return result
        except:
            return AIService._fallback_parse(text)
    
    @staticmethod
    def _fallback_parse(text):
        result = {
            'title': text[:100] if len(text) > 100 else text,
            'description': text if len(text) > 100 else '',
            'assignees': [],
            'due_date': None,
            'priority': 'medium'
        }
        
        text_lower = text.lower()
        if any(word in text_lower for word in ['urgent', 'asap', 'critical', 'emergency']):
            result['priority'] = 'critical'
        elif any(word in text_lower for word in ['important', 'high priority', 'soon']):
            result['priority'] = 'high'
        elif any(word in text_lower for word in ['low priority', 'when possible', 'eventually']):
            result['priority'] = 'low'
        
        today = datetime.utcnow()
        if 'tomorrow' in text_lower:
            result['due_date'] = (today + timedelta(days=1)).isoformat()
        elif 'next week' in text_lower:
            result['due_date'] = (today + timedelta(days=7)).isoformat()
        elif 'end of week' in text_lower:
            days_until_friday = (4 - today.weekday()) % 7
            result['due_date'] = (today + timedelta(days=days_until_friday)).isoformat()
        
        at_mentions = re.findall(r'@(\w+)', text)
        result['assignees'] = at_mentions
        
        return result
    
    @staticmethod
    def suggest_task_metadata(task, project_context=None):
        model = AIService._get_model()
        if not model:
            return AIService._fallback_suggestions(task)
        
        existing_tasks = project_context.get('existing_tasks', []) if project_context else []
        team_members = project_context.get('team_members', []) if project_context else []
        
        prompt = f"""Analyze this task and suggest improvements.
Task title: "{task.get('title', '')}"
Task description: "{task.get('description', '')}"

Existing tasks in project: {[t.get('title', '') for t in existing_tasks[:10]]}
Team members: {[m.get('name', '') for m in team_members]}

Return JSON with:
- suggested_priority: "low", "medium", "high", or "critical"
- suggested_assignees: array of team member names best suited
- related_tasks: array of existing task titles that might be related
- next_steps: array of suggested follow-up actions
- tags: array of suggested tags/labels

Only return valid JSON."""

        try:
            response = model.generate_content(prompt)
            return json.loads(response.text.strip())
        except:
            return AIService._fallback_suggestions(task)
    
    @staticmethod
    def _fallback_suggestions(task):
        return {
            'suggested_priority': 'medium',
            'suggested_assignees': [],
            'related_tasks': [],
            'next_steps': ['Review requirements', 'Break down into subtasks', 'Set deadline'],
            'tags': []
        }
    
    @staticmethod
    def suggest_schedule(tasks, team_members):
        model = AIService._get_model()
        
        task_data = [{
            'title': t.get('title'),
            'priority': t.get('priority'),
            'status': t.get('status'),
            'assignees': t.get('assignees', []),
            'due_date': t.get('due_date'),
            'time_estimate': t.get('time_estimate_hours')
        } for t in tasks[:20]]
        
        member_data = [{'name': m.get('name'), 'id': m.get('_id')} for m in team_members]
        
        if not model:
            return AIService._fallback_schedule(task_data, member_data)
        
        prompt = f"""Analyze these tasks and team members to suggest optimal scheduling.
Tasks: {json.dumps(task_data)}
Team: {json.dumps(member_data)}

Return JSON with:
- overloaded_members: array of member names with too many tasks
- suggested_redistributions: array of {{task_title, from_member, to_member}}
- suggested_due_dates: array of {{task_title, suggested_date}} for tasks without dates
- priority_adjustments: array of {{task_title, current_priority, suggested_priority, reason}}

Only return valid JSON."""

        try:
            response = model.generate_content(prompt)
            return json.loads(response.text.strip())
        except:
            return AIService._fallback_schedule(task_data, member_data)
    
    @staticmethod
    def _fallback_schedule(tasks, members):
        return {
            'overloaded_members': [],
            'suggested_redistributions': [],
            'suggested_due_dates': [],
            'priority_adjustments': []
        }
    
    @staticmethod
    def analyze_workload(tasks_by_user):
        workload = {}
        for user_id, tasks in tasks_by_user.items():
            # Handle None values for time_estimate_hours
            total_hours = sum(t.get('time_estimate_hours') or 2 for t in tasks)
            high_priority = len([t for t in tasks if t.get('priority') in ['high', 'critical']])
            in_progress = len([t for t in tasks if t.get('status') == 'in_progress'])
            overdue = len([t for t in tasks if t.get('due_date') and t.get('status') != 'done' and t.get('due_date') < datetime.utcnow().isoformat()])
            
            workload[user_id] = {
                'task_count': len(tasks),
                'estimated_hours': total_hours,
                'high_priority_count': high_priority,
                'in_progress_count': in_progress,
                'overdue_count': overdue,
                'status': 'overloaded' if total_hours > 40 else 'balanced' if total_hours > 20 else 'available'
            }
        return workload
    
    @staticmethod
    def breakdown_task(task_title, task_description, project_context=None):
        """Break down a high-level task into subtasks using AI"""
        model = AIService._get_model()
        
        team_members = project_context.get('team_members', []) if project_context else []
        existing_tasks = project_context.get('existing_tasks', []) if project_context else []
        
        if not model:
            return AIService._fallback_breakdown(task_title, task_description)
        
        prompt = f"""Break down this high-level task into smaller, actionable subtasks.

Task Title: "{task_title}"
Task Description: "{task_description}"

Team members available: {[m.get('name', '') for m in team_members]}
Existing tasks in project (for context): {[t.get('title', '') for t in existing_tasks[:10]]}

Return a JSON object with:
- subtasks: array of objects, each with:
  - title: string (clear, actionable subtask title)
  - description: string (brief description of what needs to be done)
  - estimated_hours: number (realistic time estimate)
  - priority: "low", "medium", "high", or "critical"
  - suggested_assignee: string (team member name best suited, or null)
  - order: number (suggested execution order, starting from 1)
- total_estimated_hours: number (sum of all subtask estimates)
- dependencies_note: string (any notes about task dependencies)

Generate 3-7 subtasks that together complete the main task.
Only return valid JSON, no other text."""

        try:
            response = model.generate_content(prompt)
            result = json.loads(response.text.strip())
            return result
        except:
            return AIService._fallback_breakdown(task_title, task_description)
    
    @staticmethod
    def _fallback_breakdown(task_title, task_description):
        """Fallback breakdown when AI is unavailable"""
        return {
            'subtasks': [
                {
                    'title': f'Research and plan: {task_title}',
                    'description': 'Gather requirements and create implementation plan',
                    'estimated_hours': 2,
                    'priority': 'high',
                    'suggested_assignee': None,
                    'order': 1
                },
                {
                    'title': f'Implement: {task_title}',
                    'description': 'Core implementation work',
                    'estimated_hours': 4,
                    'priority': 'high',
                    'suggested_assignee': None,
                    'order': 2
                },
                {
                    'title': f'Test and review: {task_title}',
                    'description': 'Testing and code review',
                    'estimated_hours': 2,
                    'priority': 'medium',
                    'suggested_assignee': None,
                    'order': 3
                }
            ],
            'total_estimated_hours': 8,
            'dependencies_note': 'Tasks should be completed in order'
        }
    
    @staticmethod
    def get_project_insights(tasks, team_members):
        """Generate AI-powered insights about project health and recommendations"""
        model = AIService._get_model()
        
        # Calculate basic stats
        total_tasks = len(tasks)
        completed = len([t for t in tasks if t.get('status') == 'done'])
        in_progress = len([t for t in tasks if t.get('status') == 'in_progress'])
        blocked = len([t for t in tasks if t.get('blocked_by') and len(t.get('blocked_by', [])) > 0])
        overdue = len([t for t in tasks if t.get('due_date') and t.get('status') != 'done' and t.get('due_date') < datetime.utcnow().isoformat()])
        high_priority_pending = len([t for t in tasks if t.get('priority') in ['high', 'critical'] and t.get('status') != 'done'])
        
        stats = {
            'total_tasks': total_tasks,
            'completed': completed,
            'in_progress': in_progress,
            'blocked': blocked,
            'overdue': overdue,
            'high_priority_pending': high_priority_pending,
            'completion_rate': round((completed / total_tasks * 100) if total_tasks > 0 else 0, 1)
        }
        
        if not model:
            return {
                'stats': stats,
                'health_score': 70 if overdue == 0 else 50,
                'health_status': 'good' if overdue == 0 else 'at_risk',
                'insights': [
                    f'{completed} of {total_tasks} tasks completed ({stats["completion_rate"]}%)',
                    f'{in_progress} tasks currently in progress',
                    f'{overdue} overdue tasks need attention' if overdue > 0 else 'No overdue tasks',
                ],
                'recommendations': [
                    'Focus on completing in-progress tasks before starting new ones',
                    'Review and update task priorities regularly',
                    'Consider breaking down large tasks into smaller subtasks'
                ]
            }
        
        task_summary = [{
            'title': t.get('title'),
            'status': t.get('status'),
            'priority': t.get('priority'),
            'due_date': t.get('due_date'),
            'assignees_count': len(t.get('assignees', []))
        } for t in tasks[:30]]
        
        prompt = f"""Analyze this project's task data and provide insights.

Project Statistics:
- Total tasks: {total_tasks}
- Completed: {completed}
- In Progress: {in_progress}
- Blocked: {blocked}
- Overdue: {overdue}
- High priority pending: {high_priority_pending}

Task Details: {json.dumps(task_summary)}
Team Size: {len(team_members)}

Return JSON with:
- health_score: number 0-100 (overall project health)
- health_status: "excellent", "good", "at_risk", or "critical"
- insights: array of 3-5 key observations about the project
- recommendations: array of 3-5 actionable recommendations
- bottlenecks: array of identified bottlenecks or risks

Only return valid JSON."""

        try:
            response = model.generate_content(prompt)
            result = json.loads(response.text.strip())
            result['stats'] = stats
            return result
        except:
            return {
                'stats': stats,
                'health_score': 70,
                'health_status': 'good',
                'insights': [f'{completed} of {total_tasks} tasks completed'],
                'recommendations': ['Review task priorities'],
                'bottlenecks': []
            }

    @staticmethod
    def suggest_organization_names(requested_name, existing_names):
        """Suggest alternative organization names when the requested name already exists"""
        model = AIService._get_model()
        
        if not model:
            return AIService._fallback_org_name_suggestions(requested_name, existing_names)
        
        prompt = f"""The user wants to create an organization named "{requested_name}" but this name already exists.

Existing organization names in the system: {existing_names[:20]}

Generate 5 alternative organization name suggestions that are:
1. Similar to the requested name but unique
2. Professional and appropriate for a business/team
3. Easy to remember and type
4. Not already in the existing names list

Return JSON with:
- suggestions: array of 5 alternative name strings
- reason: brief explanation of why these names were suggested

Only return valid JSON, no other text."""

        try:
            response = model.generate_content(prompt)
            result = json.loads(response.text.strip())
            return result
        except:
            return AIService._fallback_org_name_suggestions(requested_name, existing_names)
    
    @staticmethod
    def _fallback_org_name_suggestions(requested_name, existing_names):
        """Fallback name suggestions when AI is unavailable"""
        suggestions = []
        base_name = requested_name.strip()
        
        # Add variations
        suggestions.append(f"{base_name} Team")
        suggestions.append(f"{base_name} Group")
        suggestions.append(f"{base_name} Hub")
        suggestions.append(f"{base_name} Labs")
        suggestions.append(f"{base_name} Works")
        
        # Filter out any that already exist (case-insensitive)
        existing_lower = [n.lower() for n in existing_names]
        suggestions = [s for s in suggestions if s.lower() not in existing_lower]
        
        # If we filtered too many, add numbered versions
        counter = 2
        while len(suggestions) < 5:
            new_name = f"{base_name} {counter}"
            if new_name.lower() not in existing_lower:
                suggestions.append(new_name)
            counter += 1
        
        return {
            'suggestions': suggestions[:5],
            'reason': 'These are variations of your requested name that are currently available.'
        }
    
    @staticmethod
    def check_organization_name(name, existing_names):
        """Check if organization name is valid and suggest alternatives if it exists"""
        # Check if name already exists (case-insensitive)
        name_lower = name.lower().strip()
        existing_lower = [n.lower() for n in existing_names]
        
        if name_lower in existing_lower:
            suggestions = AIService.suggest_organization_names(name, existing_names)
            return {
                'available': False,
                'message': f"Organization name '{name}' already exists",
                'suggestions': suggestions.get('suggestions', []),
                'reason': suggestions.get('reason', '')
            }
        
        return {
            'available': True,
            'message': f"Organization name '{name}' is available",
            'suggestions': [],
            'reason': ''
        }
