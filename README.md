# MentorLagbe — Client

MentorLagbe is a modern online tutoring platform that connects students with qualified tutors across Bangladesh. Students can find suitable tutors, apply for tuition opportunities, and manage their learning journey, while tutors can create tuition posts and manage student applications.

## 🚀 Features

### 👨‍🎓 Student
- Browse and search available tuition opportunities.
- Filter tuitions by subject, location, and other criteria.
- View detailed tuition information.
- Apply for tuition opportunities.
- Save and manage bookmarked tuitions.
- Track application status.
- Manage personal profile and profile picture.
- Upgrade to Student Pro membership.
- View payment history.

### 👨‍🏫 Tutor
- Create, edit, and manage tuition posts.
- View and manage student applications.
- Track tuition activities.
- Manage personal profile and profile picture.
- Upgrade to Tutor Pro membership.
- View payment history.

### 🛡️ Admin
- Manage platform users.
- Manage tuition posts.
- Review and approve or reject pending tuitions.
- View and manage transactions.
- Search and filter records.

### 🌟 General Features
- Responsive user interface.
- Google Authentication and email/password authentication.
- Role-based dashboards.
- Dark and Light theme.
- Secure authentication.
- Stripe payment integration.
- Profile image upload using ImgBB.
- Loading, error, and not-found pages.

## 🛠️ Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

### Authentication & Services
- Better Auth
- Stripe
- ImgBB

### Development Tools
- Git
- GitHub
- npm

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aynan-codes/mentorlagbe-client.git
```

### 2. Navigate to the Project Directory

```bash
cd mentorlagbe-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and add the environment variables required by the application.

Use the variable names defined in the project's configuration files. Never share secret keys or credentials publicly.

### 5. Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 🏗️ Production Build

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 💳 Membership Plans

| Membership | Price |
|---|---:|
| Student Pro | $10 |
| Tutor Pro | $15 |

Payments are integrated using Stripe Checkout.

## 🔐 Security

- Authentication-based protected routes.
- Role-based access control.
- Secure API communication.
- Environment variables for sensitive configuration.
- Payment processing through Stripe.

## 👨‍💻 Author

**Abu Baten Mohammad Aynan**

- GitHub: [aynan-codes](https://github.com/aynan-codes)
- LinkedIn: [Abu Baten Mohammad Aynan](https://www.linkedin.com/in/abu-baten-aynan/)

---

⭐ If you find this project useful, consider giving it a star!
