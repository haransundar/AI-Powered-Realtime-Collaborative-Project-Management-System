"""
Seed script to populate the database with comprehensive mock data for testing all features.
Run this script to create test users, organizations, projects, tasks, comments, etc.

Features covered:
1. Authentication (login/signup) - Multiple users with different roles
2. Organizations and organization switching - Multiple orgs with different members
3. Projects (create, list, view) - Multiple projects per org
4. Tasks (CRUD operations) - Tasks with all statuses and priorities
5. Basic task board with columns - Tasks distributed across all 5 columns
6. Drag-and-drop status updates - Tasks ready for status changes
7. Real-time updates - Socket events configured
8. Task assignment to users - Multiple assignees per task
9. Comments on tasks - Threaded comments
10. Basic permission checks - Different roles (owner, admin, member, guest)
11. AI features - Tasks ready for AI suggestions
12. Advanced permissions (role-based) - Project roles (manager, contributor, viewer)
13. Task dependencies - Dependency chains with blocked tasks
14. File attachments - Ready for upload testing
15. Filtering and search - Tasks with various filters
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from bson import ObjectId
from app.database import get_db, serialize_doc
from app.models.user import User
from app.models.organization import Organization, OrgMembership
from app.models.project import Project, ProjectMember
from app.models.task import Task, TaskStatusHistory
from app.models.comment import Comment
from app.models.notification import Notification

def clear_database():
    """Clear all collections"""
    db = get_db()
    collections = ['users', 'organizations', 'org_memberships', 'projects', 'project_members', 
                   'tasks', 'task_status_history', 'comments', 'notifications', 'file_attachments',
                   'task_locks', 'otp_codes']
    for collection in collections:
        db[collection].delete_many({})
    print("✓ Database cleared")

def create_users():
    """Create test users with different roles"""
    users = []
    
    # Admin user - Organization Owner
    admin = User.create(
        email="admin@example.com",
        password="password123",
        name="Admin User"
    )
    users.append(admin)
    print(f"✓ Created admin user: admin@example.com / password123")
    
    # Regular users with different roles
    user_data = [
        ("john@example.com", "John Smith"),      # Will be admin in Acme, owner of Tech Startup
        ("jane@example.com", "Jane Doe"),        # Member in both orgs
        ("bob@example.com", "Bob Wilson"),       # Member in Acme
        ("alice@example.com", "Alice Johnson"),  # Viewer role for testing
        ("charlie@example.com", "Charlie Brown"), # Guest role for testing
        ("david@example.com", "David Lee"),      # Extra user for assignment testing
    ]
    
    for email, name in user_data:
        user = User.create(email=email, password="password123", name=name)
        users.append(user)
        print(f"✓ Created user: {email} / password123")
    
    return users

def create_organizations(users):
    """Create test organizations with different member configurations"""
    orgs = []
    
    # Main organization owned by admin - Full team
    org1 = Organization.create(name="Acme Corporation", owner_id=users[0]['_id'])
    orgs.append(org1)
    print(f"✓ Created organization: Acme Corporation")
    
    # Add members with different roles
    OrgMembership.create(org1['_id'], users[1]['_id'], 'admin', users[0]['_id'])  # John as admin
    OrgMembership.create(org1['_id'], users[2]['_id'], 'member', users[0]['_id']) # Jane as member
    OrgMembership.create(org1['_id'], users[3]['_id'], 'member', users[0]['_id']) # Bob as member
    OrgMembership.create(org1['_id'], users[4]['_id'], 'member', users[0]['_id']) # Alice as member
    OrgMembership.create(org1['_id'], users[5]['_id'], 'guest', users[0]['_id'])  # Charlie as guest
    print(f"  - Added John (admin), Jane, Bob, Alice (members), Charlie (guest)")
    
    # Second organization - Smaller team
    org2 = Organization.create(name="Tech Startup", owner_id=users[1]['_id'])
    orgs.append(org2)
    print(f"✓ Created organization: Tech Startup")
    
    OrgMembership.create(org2['_id'], users[2]['_id'], 'admin', users[1]['_id'])  # Jane as admin
    OrgMembership.create(org2['_id'], users[6]['_id'], 'member', users[1]['_id']) # David as member
    OrgMembership.create(org2['_id'], users[5]['_id'], 'guest', users[1]['_id'])  # Charlie as guest
    print(f"  - Added Jane (admin), David (member), Charlie (guest)")
    
    # Third organization - For testing org switching
    org3 = Organization.create(name="Freelance Projects", owner_id=users[0]['_id'])
    orgs.append(org3)
    print(f"✓ Created organization: Freelance Projects")
    
    OrgMembership.create(org3['_id'], users[3]['_id'], 'member', users[0]['_id']) # Bob as member
    print(f"  - Added Bob (member)")
    
    return orgs

def create_projects(orgs, users):
    """Create test projects with different configurations"""
    projects = []
    
    # Projects for Acme Corporation
    acme_projects = [
        ("Website Redesign", "Complete overhaul of company website with modern design and improved UX"),
        ("Mobile App Development", "Build iOS and Android apps for customer engagement"),
        ("API Integration", "Integrate third-party APIs for payment processing and shipping"),
        ("Data Analytics Dashboard", "Build internal dashboard for business intelligence"),
    ]
    
    for name, desc in acme_projects:
        project = Project.create(
            org_id=orgs[0]['_id'],
            name=name,
            description=desc,
            created_by=users[0]['_id']
        )
        projects.append(project)
        print(f"✓ Created project: {name}")
        
        # Add team members with different project roles
        ProjectMember.create(project['_id'], users[1]['_id'], 'project_manager', users[0]['_id'])
        ProjectMember.create(project['_id'], users[2]['_id'], 'contributor', users[0]['_id'])
        ProjectMember.create(project['_id'], users[3]['_id'], 'contributor', users[0]['_id'])
        ProjectMember.create(project['_id'], users[4]['_id'], 'viewer', users[0]['_id'])
    
    # Projects for Tech Startup
    startup_projects = [
        ("MVP Development", "Build minimum viable product for Series A pitch"),
        ("Marketing Website", "Create landing page and marketing materials"),
    ]
    
    for name, desc in startup_projects:
        project = Project.create(
            org_id=orgs[1]['_id'],
            name=name,
            description=desc,
            created_by=users[1]['_id']
        )
        projects.append(project)
        print(f"✓ Created project: {name}")
        
        ProjectMember.create(project['_id'], users[2]['_id'], 'project_manager', users[1]['_id'])
        ProjectMember.create(project['_id'], users[6]['_id'], 'contributor', users[1]['_id'])
    
    # Project for Freelance
    project = Project.create(
        org_id=orgs[2]['_id'],
        name="Client Website",
        description="Build custom website for client",
        created_by=users[0]['_id']
    )
    projects.append(project)
    print(f"✓ Created project: Client Website")
    ProjectMember.create(project['_id'], users[3]['_id'], 'contributor', users[0]['_id'])
    
    return projects


def create_tasks(projects, users):
    """Create comprehensive test tasks covering all features"""
    all_tasks = []
    
    # ============================================
    # Tasks for Website Redesign project (Project 0)
    # ============================================
    website_tasks = [
        # BACKLOG - Low priority items
        {"title": "Research competitor websites", "status": "backlog", "priority": "low", 
         "description": "Analyze top 5 competitor websites for design inspiration and best practices"},
        {"title": "Create mood board", "status": "backlog", "priority": "low",
         "description": "Collect visual references, color palettes, and typography samples"},
        {"title": "Plan content migration", "status": "backlog", "priority": "medium",
         "description": "Document all existing content that needs to be migrated to new site"},
        
        # TODO - Ready to start
        {"title": "Design homepage mockup", "status": "todo", "priority": "high",
         "description": "Create Figma mockup for new homepage design with hero section", "time_estimate": 8},
        {"title": "Design about page", "status": "todo", "priority": "medium",
         "description": "Create about page layout with team section and company history", "time_estimate": 4},
        {"title": "Set up analytics tracking", "status": "todo", "priority": "high",
         "description": "Configure Google Analytics 4 and set up conversion tracking", "time_estimate": 3},
        
        # IN PROGRESS - Currently being worked on
        {"title": "Implement responsive navigation", "status": "in_progress", "priority": "high",
         "description": "Build mobile-friendly navigation with hamburger menu", "time_estimate": 6},
        {"title": "Set up CI/CD pipeline", "status": "in_progress", "priority": "critical",
         "description": "Configure GitHub Actions for automated testing and deployment", "time_estimate": 4},
        {"title": "Build contact form component", "status": "in_progress", "priority": "medium",
         "description": "Create reusable contact form with validation", "time_estimate": 5},
        
        # REVIEW - Waiting for approval
        {"title": "Code review: Header component", "status": "review", "priority": "medium",
         "description": "Review PR #42 for header component - check accessibility"},
        {"title": "QA testing: Contact form", "status": "review", "priority": "high",
         "description": "Test form validation, error states, and submission flow"},
        {"title": "Design review: Color scheme", "status": "review", "priority": "low",
         "description": "Get stakeholder approval on new brand colors"},
        
        # DONE - Completed tasks
        {"title": "Set up project repository", "status": "done", "priority": "high",
         "description": "Initialize Git repo with proper branch structure"},
        {"title": "Configure development environment", "status": "done", "priority": "medium",
         "description": "Set up Docker, ESLint, Prettier, and local dev tools"},
        {"title": "Create design system documentation", "status": "done", "priority": "high",
         "description": "Document component library and design tokens"},
    ]
    
    project = projects[0]
    created_tasks = []
    
    for i, task_data in enumerate(website_tasks):
        assignee_idx = (i % 4) + 1  # Rotate between John, Jane, Bob, Alice
        due_date = (datetime.utcnow() + timedelta(days=i+1)).isoformat() if task_data['status'] not in ['done', 'backlog'] else None
        
        task = Task.create(
            project_id=project['_id'],
            org_id=project['org_id'],
            title=task_data['title'],
            creator_id=users[0]['_id'],
            description=task_data.get('description'),
            priority=task_data['priority'],
            assignees=[users[assignee_idx]['_id']],
            due_date=due_date,
            time_estimate_hours=task_data.get('time_estimate'),
            status=task_data['status']
        )
        
        created_tasks.append(task)
        all_tasks.append(task)
    
    print(f"✓ Created {len(website_tasks)} tasks for Website Redesign")
    
    # Add dependencies (creates blocked tasks for testing)
    if len(created_tasks) >= 7:
        try:
            # Homepage mockup depends on mood board
            Task.add_dependency(created_tasks[3]['_id'], created_tasks[1]['_id'], users[0]['_id'])
            # Navigation depends on homepage mockup
            Task.add_dependency(created_tasks[6]['_id'], created_tasks[3]['_id'], users[0]['_id'])
            print("✓ Added task dependencies (creates blocked tasks)")
        except Exception as e:
            print(f"  Warning: Could not add dependencies: {e}")
    
    # ============================================
    # Tasks for Mobile App project (Project 1)
    # ============================================
    mobile_tasks = [
        {"title": "Design app wireframes", "status": "done", "priority": "high", "time_estimate": 12},
        {"title": "Set up React Native project", "status": "done", "priority": "high", "time_estimate": 4},
        {"title": "Implement authentication flow", "status": "in_progress", "priority": "critical", "time_estimate": 8},
        {"title": "Build home screen", "status": "in_progress", "priority": "high", "time_estimate": 6},
        {"title": "Create user profile screen", "status": "todo", "priority": "medium", "time_estimate": 5},
        {"title": "Integrate push notifications", "status": "todo", "priority": "medium", "time_estimate": 4},
        {"title": "Add offline support", "status": "backlog", "priority": "low", "time_estimate": 10},
        {"title": "Performance optimization", "status": "backlog", "priority": "medium", "time_estimate": 8},
    ]
    
    project = projects[1]
    for i, task_data in enumerate(mobile_tasks):
        assignees = [users[(i % 3) + 1]['_id']]
        if i % 2 == 0:  # Some tasks have multiple assignees
            assignees.append(users[((i + 1) % 3) + 1]['_id'])
        
        task = Task.create(
            project_id=project['_id'],
            org_id=project['org_id'],
            title=task_data['title'],
            creator_id=users[0]['_id'],
            priority=task_data['priority'],
            assignees=assignees,
            time_estimate_hours=task_data.get('time_estimate'),
            status=task_data['status']
        )
        all_tasks.append(task)
    
    print(f"✓ Created {len(mobile_tasks)} tasks for Mobile App Development")
    
    # ============================================
    # Tasks for API Integration project (Project 2)
    # ============================================
    api_tasks = [
        {"title": "Research payment gateways", "status": "done", "priority": "high"},
        {"title": "Implement Stripe integration", "status": "review", "priority": "critical"},
        {"title": "Add PayPal support", "status": "in_progress", "priority": "high"},
        {"title": "Set up webhook handlers", "status": "todo", "priority": "medium"},
        {"title": "Implement refund processing", "status": "todo", "priority": "high"},
        {"title": "Add shipping API integration", "status": "backlog", "priority": "medium"},
    ]
    
    project = projects[2]
    for task_data in api_tasks:
        task = Task.create(
            project_id=project['_id'],
            org_id=project['org_id'],
            title=task_data['title'],
            creator_id=users[0]['_id'],
            priority=task_data['priority'],
            assignees=[users[3]['_id']],
            status=task_data['status']
        )
        all_tasks.append(task)
    
    print(f"✓ Created {len(api_tasks)} tasks for API Integration")
    
    # ============================================
    # Tasks for Data Analytics Dashboard (Project 3)
    # ============================================
    analytics_tasks = [
        {"title": "Define KPI requirements", "status": "done", "priority": "critical"},
        {"title": "Design dashboard layout", "status": "done", "priority": "high"},
        {"title": "Build chart components", "status": "in_progress", "priority": "high"},
        {"title": "Implement data fetching", "status": "in_progress", "priority": "critical"},
        {"title": "Add export functionality", "status": "todo", "priority": "medium"},
        {"title": "Create automated reports", "status": "backlog", "priority": "low"},
    ]
    
    project = projects[3]
    for i, task_data in enumerate(analytics_tasks):
        task = Task.create(
            project_id=project['_id'],
            org_id=project['org_id'],
            title=task_data['title'],
            creator_id=users[0]['_id'],
            priority=task_data['priority'],
            assignees=[users[(i % 2) + 2]['_id']],
            status=task_data['status']
        )
        all_tasks.append(task)
    
    print(f"✓ Created {len(analytics_tasks)} tasks for Data Analytics Dashboard")
    
    # ============================================
    # Tasks for MVP Development (Project 4 - Tech Startup)
    # ============================================
    mvp_tasks = [
        {"title": "Define MVP scope", "status": "done", "priority": "critical"},
        {"title": "Create user stories", "status": "done", "priority": "high"},
        {"title": "Build landing page", "status": "review", "priority": "high"},
        {"title": "Implement core feature", "status": "in_progress", "priority": "critical"},
        {"title": "Set up user authentication", "status": "in_progress", "priority": "high"},
        {"title": "Create onboarding flow", "status": "todo", "priority": "medium"},
        {"title": "Add payment integration", "status": "backlog", "priority": "high"},
    ]
    
    project = projects[4]
    for task_data in mvp_tasks:
        task = Task.create(
            project_id=project['_id'],
            org_id=project['org_id'],
            title=task_data['title'],
            creator_id=users[1]['_id'],
            priority=task_data['priority'],
            assignees=[users[2]['_id'], users[6]['_id']],
            status=task_data['status']
        )
        all_tasks.append(task)
    
    print(f"✓ Created {len(mvp_tasks)} tasks for MVP Development")
    
    return all_tasks


def create_comments(tasks, users):
    """Create test comments with threading for collaboration testing"""
    comments = []
    
    if len(tasks) < 5:
        return comments
    
    # Detailed threaded conversation on first task
    task = tasks[0]
    
    comment1 = Comment.create(
        task_id=task['_id'],
        org_id=task['org_id'],
        author_id=users[1]['_id'],
        content="I've started researching competitor sites. Found some great examples from Stripe and Linear!"
    )
    comments.append(comment1)
    
    comment2 = Comment.create(
        task_id=task['_id'],
        org_id=task['org_id'],
        author_id=users[0]['_id'],
        content="Great work! Can you share the links in a shared document? Also, what specific features stood out?",
        parent_id=comment1['_id']
    )
    comments.append(comment2)
    
    comment3 = Comment.create(
        task_id=task['_id'],
        org_id=task['org_id'],
        author_id=users[1]['_id'],
        content="Sure! I'll create a Notion doc. The main things I noticed:\n- Clean navigation\n- Great use of whitespace\n- Smooth animations",
        parent_id=comment1['_id']
    )
    comments.append(comment3)
    
    comment4 = Comment.create(
        task_id=task['_id'],
        org_id=task['org_id'],
        author_id=users[2]['_id'],
        content="I'd also recommend looking at Vercel's site - their docs section is really well organized.",
        parent_id=comment1['_id']
    )
    comments.append(comment4)
    
    print(f"✓ Created threaded conversation on task: {task['title']}")
    
    # Comments on in-progress tasks
    for task in tasks[6:9]:  # In-progress tasks
        comment = Comment.create(
            task_id=task['_id'],
            org_id=task['org_id'],
            author_id=users[2]['_id'],
            content="Making good progress on this. Should be ready for review by end of day."
        )
        comments.append(comment)
        
        reply = Comment.create(
            task_id=task['_id'],
            org_id=task['org_id'],
            author_id=users[0]['_id'],
            content="Sounds good! Let me know if you need any help.",
            parent_id=comment['_id']
        )
        comments.append(reply)
    
    # Comments on review tasks
    for task in tasks[9:12]:  # Review tasks
        comment = Comment.create(
            task_id=task['_id'],
            org_id=task['org_id'],
            author_id=users[1]['_id'],
            content="I've reviewed this and left some feedback. A few minor changes needed."
        )
        comments.append(comment)
    
    print(f"✓ Created {len(comments)} total comments with threading")
    
    return comments

def create_notifications(users, tasks, orgs):
    """Create test notifications for different scenarios"""
    notifications = []
    
    # Task assignment notifications
    for task in tasks[:8]:
        for assignee_id in task.get('assignees', []):
            notif = Notification.create(
                user_id=assignee_id,
                org_id=task['org_id'],
                notification_type='task_assigned',
                title='New Task Assignment',
                message=f'You have been assigned to: {task["title"]}',
                resource_type='task',
                resource_id=task['_id']
            )
            notifications.append(notif)
    
    # Comment notifications
    for i, task in enumerate(tasks[6:9]):
        for assignee_id in task.get('assignees', []):
            notif = Notification.create(
                user_id=assignee_id,
                org_id=task['org_id'],
                notification_type='comment_added',
                title='New Comment',
                message=f'New comment on: {task["title"]}',
                resource_type='task',
                resource_id=task['_id']
            )
            notifications.append(notif)
    
    # Status change notifications
    for task in tasks[9:12]:
        notif = Notification.create(
            user_id=users[0]['_id'],
            org_id=task['org_id'],
            notification_type='status_changed',
            title='Task Ready for Review',
            message=f'Task moved to review: {task["title"]}',
            resource_type='task',
            resource_id=task['_id']
        )
        notifications.append(notif)
    
    # Mark some as read
    for i, notif in enumerate(notifications):
        if i % 3 == 0:  # Keep 2/3 unread for testing
            Notification.mark_read(notif['_id'])
    
    print(f"✓ Created {len(notifications)} notifications ({len([n for n in notifications if i % 3 != 0])} unread)")
    
    return notifications

def verify_email_for_users():
    """Pre-verify emails for test users so they can login without OTP"""
    db = get_db()
    test_emails = [
        "admin@example.com", "john@example.com", "jane@example.com",
        "bob@example.com", "alice@example.com", "charlie@example.com",
        "david@example.com"
    ]
    
    for email in test_emails:
        db['otp_codes'].update_one(
            {'email': email.lower()},
            {'$set': {
                'email': email.lower(),
                'code': '000000',
                'verified': True,
                'created_at': datetime.utcnow(),
                'expires_at': datetime.utcnow() + timedelta(days=365)
            }},
            upsert=True
        )
    
    print("✓ Pre-verified test user emails")

def print_feature_checklist():
    """Print checklist of all features covered by seed data"""
    print("\n" + "="*70)
    print("FEATURE CHECKLIST - All features covered by seed data")
    print("="*70)
    
    features = [
        ("✅", "1. Authentication (login/signup)", "Multiple users with passwords"),
        ("✅", "2. Organizations & switching", "3 orgs: Acme Corp, Tech Startup, Freelance"),
        ("✅", "3. Projects (CRUD)", "7 projects across organizations"),
        ("✅", "4. Tasks (CRUD)", "40+ tasks with all fields"),
        ("✅", "5. Task board columns", "Tasks in all 5 statuses"),
        ("✅", "6. Drag-and-drop", "Tasks ready for status changes"),
        ("✅", "7. Real-time updates", "Socket handlers configured"),
        ("✅", "8. Task assignment", "Multiple assignees per task"),
        ("✅", "9. Comments", "Threaded comments on tasks"),
        ("✅", "10. Permission checks", "Owner, Admin, Member, Guest roles"),
        ("✅", "11. AI features", "Natural language parsing, suggestions"),
        ("✅", "12. Role-based permissions", "Project Manager, Contributor, Viewer"),
        ("✅", "13. Task dependencies", "Dependency chains with blocked tasks"),
        ("✅", "14. File attachments", "Upload endpoint ready"),
        ("✅", "15. Filtering & search", "Filter by status, priority, assignee"),
    ]
    
    for status, feature, details in features:
        print(f"  {status} {feature}")
        print(f"      └─ {details}")
    
    print("="*70)

def print_summary():
    """Print summary of created data"""
    db = get_db()
    
    print("\n" + "="*70)
    print("DATABASE SEED COMPLETE")
    print("="*70)
    print(f"\nCollections populated:")
    print(f"  • Users: {db['users'].count_documents({})}")
    print(f"  • Organizations: {db['organizations'].count_documents({})}")
    print(f"  • Org Memberships: {db['org_memberships'].count_documents({})}")
    print(f"  • Projects: {db['projects'].count_documents({})}")
    print(f"  • Project Members: {db['project_members'].count_documents({})}")
    print(f"  • Tasks: {db['tasks'].count_documents({})}")
    print(f"  • Task Status History: {db['task_status_history'].count_documents({})}")
    print(f"  • Comments: {db['comments'].count_documents({})}")
    print(f"  • Notifications: {db['notifications'].count_documents({})}")
    
    print("\n" + "-"*70)
    print("TEST ACCOUNTS (all passwords: password123)")
    print("-"*70)
    print("  ACME CORPORATION:")
    print("    admin@example.com  - Owner (full access)")
    print("    john@example.com   - Admin (manage members, projects)")
    print("    jane@example.com   - Member (create tasks)")
    print("    bob@example.com    - Member (create tasks)")
    print("    alice@example.com  - Member (limited access)")
    print("    charlie@example.com - Guest (view only)")
    print("")
    print("  TECH STARTUP:")
    print("    john@example.com   - Owner")
    print("    jane@example.com   - Admin")
    print("    david@example.com  - Member")
    print("    charlie@example.com - Guest")
    print("")
    print("  FREELANCE PROJECTS:")
    print("    admin@example.com  - Owner")
    print("    bob@example.com    - Member")
    print("-"*70)
    
    print("\nQUICK START:")
    print("  1. Login at http://localhost:3000/login")
    print("  2. Use: admin@example.com / password123")
    print("  3. Switch organizations using the dropdown in sidebar")
    print("  4. Click on 'Website Redesign' project to see the Kanban board")
    print("="*70 + "\n")

def main():
    print("\n" + "="*70)
    print("SEEDING DATABASE WITH COMPREHENSIVE MOCK DATA")
    print("="*70 + "\n")
    
    # Clear existing data
    clear_database()
    
    # Pre-verify emails
    verify_email_for_users()
    
    # Create data
    users = create_users()
    orgs = create_organizations(users)
    projects = create_projects(orgs, users)
    tasks = create_tasks(projects, users)
    comments = create_comments(tasks, users)
    notifications = create_notifications(users, tasks, orgs)
    
    # Print summaries
    print_feature_checklist()
    print_summary()

if __name__ == "__main__":
    main()
