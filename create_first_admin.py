"""
Quick script to create the first Admin user.
Run this in your activated virtual environment: python create_first_admin.py
"""

import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.database import SessionLocal
    from app.models import User, UserRole
    from app.auth import get_password_hash

    def create_first_admin():
        db = SessionLocal()
        try:
            # Check if any admin exists
            admin_exists = db.query(User).filter(User.role == UserRole.ADMIN).first()
            if admin_exists:
                print("=" * 60)
                print("⚠️  An Admin user already exists!")
                print("=" * 60)
                print(f"Email: {admin_exists.email}")
                print(f"Name: {admin_exists.name}")
                print(f"\nYou can login and create more users from the Admin Dashboard.")
                return

            print("=" * 60)
            print("CREATE FIRST ADMIN USER")
            print("=" * 60)
            print("\nThis will create the first admin user for ProjectHub.")
            print("After this, login as Admin to create Manager users.\n")

            # Predefined admin credentials (you can change these)
            name = "Admin User"
            email = "admin@projecthub.com"
            password = "admin123"  # CHANGE THIS!

            print(f"Creating admin user:")
            print(f"  Name: {name}")
            print(f"  Email: {email}")
            print(f"  Password: {password}")
            print(f"  Role: Admin")
            print()

            confirm = input("Continue? (yes/no): ").strip().lower()
            if confirm not in ['yes', 'y']:
                print("Cancelled.")
                return

            # Check if email already exists
            existing = db.query(User).filter(User.email == email).first()
            if existing:
                print(f"\n❌ Error: Email '{email}' is already registered!")
                print(f"   User: {existing.name} (Role: {existing.role.value})")
                return

            # Create admin user
            hashed_password = get_password_hash(password)
            admin_user = User(
                name=name,
                email=email,
                password_hash=hashed_password,
                role=UserRole.ADMIN
            )

            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

            print("\n" + "=" * 60)
            print("✓ ADMIN USER CREATED SUCCESSFULLY!")
            print("=" * 60)
            print(f"  ID: {admin_user.id}")
            print(f"  Name: {admin_user.name}")
            print(f"  Email: {admin_user.email}")
            print(f"  Role: {admin_user.role.value}")
            print()
            print("Next steps:")
            print("  1. Start the backend: uvicorn app.main:app --reload")
            print("  2. Start the frontend: cd frontend && npm start")
            print("  3. Login with the credentials above")
            print("  4. Create Manager users from the Admin Dashboard")
            print("=" * 60)

        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            db.rollback()
            import traceback
            traceback.print_exc()
        finally:
            db.close()

    if __name__ == "__main__":
        create_first_admin()

except ImportError as e:
    print("=" * 60)
    print("❌ ERROR: Required modules not found")
    print("=" * 60)
    print(f"Error: {e}")
    print()
    print("Please make sure you've activated your virtual environment:")
    print()
    print("  On Windows:")
    print("    venv\\Scripts\\activate")
    print()
    print("  Then run this script again:")
    print("    python create_first_admin.py")
    print("=" * 60)
