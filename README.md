# College Bus Pass System

A comprehensive MERN stack application for managing college bus pass applications, approvals, renewals, and NFC-based verification.

## 🚀 Features

- **Student Portal**: Signup, login, apply for passes, track status, download PDF passes, and view AI-generated summaries.
- **Admin Dashboard**: Analytics, application management (approve/reject), route management, and audit logs.
- **AI Integration**: Groq-powered application summarization and decision-making assistance.
- **NFC Support**: Simulated NFC tag mapping and verification endpoint for transit staff.
- **Modern UI**: Built with React, Tailwind CSS, Framer Motion, and Lucide Icons.
- **Security**: JWT authentication, role-based access control, and secure file handling.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Multer.
- **AI**: Groq API (Llama 3.1).
- **Utilities**: PDFKit, QRCode, jsPDF.

## 📥 Installation

1. **Clone the repository**
2. **Setup Backend**:
   - `cd backend`
   - `npm install`
   - Create `.env` with provided configuration.
   - `npm start`
3. **Setup Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## 🔐 Admin Credentials

- **Email**: `admin@gmail.com`
- **Password**: `admin123`

- Summarizes student applications for quick admin review.
- Generates professional rejection/approval reasons.
- Detects inconsistencies in application data.

## ✅ Project Status & API Testing

The project is now fully functional and verified. A comprehensive API testing suite was executed with a **100% pass rate**.

### Final Test Results (Feb 11, 2026)

| # | Test Scenario | Status | Details |
|---|---|---|---|
| 1 | Admin Login | ✅ PASS | JWT Token issued |
| 2 | Route Creation | ✅ PASS | Dynamic stops & pricing (monthly/sem/yearly) |
| 3 | Student Signup | ✅ PASS | Unique profile creation |
| 4 | Student Login | ✅ PASS | Authenticated access |
| 5 | Pass Application | ✅ PASS | Multi-document upload & AI analysis |
| 6 | Admin Approval | ✅ PASS | Decision logging & NFC tag generation |
| 7 | NFC Verification | ✅ PASS | Transit-side validation working |
| 8 | Dashboard Stats | ✅ PASS | Real-time analytics |
| 9 | Blacklisting | ✅ PASS | Security revocation functional |

**All systems go!** 🚀
