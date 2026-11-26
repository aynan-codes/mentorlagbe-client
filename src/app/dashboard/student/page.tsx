import StudentOverview from "@/components/dashboard/student/student-overview";

export default function StudentDashboardPage() {
  return <StudentOverview />;
}





// import Link from "next/link";
// import {
//   FileText,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   Crown,
//   ArrowRight,
//   BookOpen,
//   Search,
// } from "lucide-react";

// const stats = [
//   {
//     title: "Total Applications",
//     value: "0",
//     icon: FileText,
//     color: "bg-blue-100 text-blue-600",
//   },
//   {
//     title: "Pending Applications",
//     value: "0",
//     icon: Clock,
//     color: "bg-amber-100 text-amber-600",
//   },
//   {
//     title: "Approved Applications",
//     value: "0",
//     icon: CheckCircle2,
//     color: "bg-green-100 text-green-600",
//   },
//   {
//     title: "Rejected Applications",
//     value: "0",
//     icon: XCircle,
//     color: "bg-red-100 text-red-600",
//   },
// ];

// export default function StudentDashboardPage() {
//   return (
//     <main className="min-h-screen bg-[#F8FAFC] p-4 dark:bg-[#0F172A] sm:p-6 lg:p-8">
//       <div className="mx-auto max-w-7xl space-y-8">
//         {/* Welcome Section */}
//         <section>
//           <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
//             Student Dashboard
//           </h1>
//           <p className="mt-2 text-slate-500 dark:text-slate-400">
//             Welcome back! Manage your tuition applications and learning
//             journey from here.
//           </p>
//         </section>

//         {/* Statistics */}
//         <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//           {stats.map((stat) => {
//             const Icon = stat.icon;

//             return (
//               <div
//                 key={stat.title}
//                 className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
//                       {stat.title}
//                     </p>
//                     <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
//                       {stat.value}
//                     </h2>
//                   </div>

//                   <div
//                     className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
//                   >
//                     <Icon size={24} />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </section>

//         {/* Subscription */}
//         <section className="rounded-2xl bg-gradient-to-r from-[#2748A5] to-[#4169E1] p-6 text-white shadow-lg sm:p-8">
//           <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
//             <div>
//               <div className="mb-3 flex items-center gap-2">
//                 <Crown size={22} />
//                 <span className="font-semibold">Your Subscription</span>
//               </div>

//               <h2 className="text-2xl font-bold">Free Plan</h2>

//               <p className="mt-2 text-sm text-blue-100">
//                 Upgrade to Pro to enjoy premium student features.
//               </p>
//             </div>

//             <Link
//               href="/pricing"
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#2748A5] transition hover:bg-blue-50"
//             >
//               Upgrade to Pro
//               <ArrowRight size={18} />
//             </Link>
//           </div>
//         </section>

//         {/* Recent Applications */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
//           <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//             <div>
//               <h2 className="text-xl font-bold text-slate-900 dark:text-white">
//                 Recent Applications
//               </h2>
//               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                 Track the status of your recent tuition applications.
//               </p>
//             </div>

//             <Link
//               href="/dashboard/student/applications"
//               className="inline-flex items-center gap-2 text-sm font-semibold text-[#4169E1] hover:text-[#2748A5]"
//             >
//               View All
//               <ArrowRight size={16} />
//             </Link>
//           </div>

//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E0EAFF] text-[#4169E1]">
//               <BookOpen size={30} />
//             </div>

//             <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
//               No Applications Yet
//             </h3>

//             <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
//               You have not applied for any tuition yet. Explore available
//               tuitions and find the right tutor for your learning journey.
//             </p>

//             <Link
//               href="/tuitions"
//               className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4169E1] px-6 py-3 font-semibold text-white transition hover:bg-[#2748A5]"
//             >
//               <Search size={18} />
//               Explore Tuitions
//             </Link>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }