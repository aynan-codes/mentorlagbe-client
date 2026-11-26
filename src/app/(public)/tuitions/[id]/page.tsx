// import Link from "next/link";
// import Image from "next/image";
// import {
//   ArrowLeft,
//   ArrowRight,
//   CalendarDays,
//   Clock,
//   GraduationCap,
//   MapPin,
//   Monitor,
//   BookOpen,
//   UserRound,
//   Wallet,
// } from "lucide-react";
// import { notFound } from "next/navigation";

// import { getTuitionById } from "@/services/tuition.service";

// interface TuitionDetailsPageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default async function TuitionDetailsPage({
//   params,
// }: TuitionDetailsPageProps) {
//   const { id } = await params;

//   let tuition;

//   try {
//     tuition = await getTuitionById(id);
//   } catch {
//     notFound();
//   }

//   if (!tuition) {
//     notFound();
//   }

//   const details = [
//     {
//       label: "Subject",
//       value: tuition.subject,
//       icon: BookOpen,
//     },
//     {
//       label: "Class Level",
//       value: tuition.classLevel,
//       icon: GraduationCap,
//     },
//     {
//       label: "Location",
//       value: tuition.location,
//       icon: MapPin,
//     },
//     {
//       label: "Learning Mode",
//       value: tuition.mode,
//       icon: Monitor,
//     },
//     {
//       label: "Days Per Week",
//       value: `${tuition.daysPerWeek} Days`,
//       icon: CalendarDays,
//     },
//     {
//       label: "Monthly Fee",
//       value: `৳${tuition.monthlyFee.toLocaleString("en-BD")}`,
//       icon: Wallet,
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-[#F8FAFC] py-10 dark:bg-[#0F172A]">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Back Button */}
//         <Link
//           href="/tuitions"
//           className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4169E1] transition hover:text-[#2748A5]"
//         >
//           <ArrowLeft size={18} />
//           Back to All Tuitions
//         </Link>

//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//           {/* Main Content */}
//           <div className="space-y-8 lg:col-span-2">
//             {/* Banner */}
//             <div className="relative h-64 overflow-hidden rounded-2xl bg-[#E0EAFF] sm:h-80">
//               {tuition.bannerImage ? (
//                 <Image
//                   src={tuition.bannerImage}
//                   alt={tuition.title}
//                   fill
//                   priority
//                   unoptimized
//                   className="object-cover"
//                   sizes="(max-width: 768px) 100vw, 66vw"
//                 />
//               ) : (
//                 <div className="flex h-full items-center justify-center">
//                   <GraduationCap
//                     size={80}
//                     className="text-[#4169E1]"
//                   />
//                 </div>
//               )}

//               <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#4169E1] shadow">
//                 {tuition.approvalStatus === "approved"
//                   ? "Verified Tuition"
//                   : tuition.approvalStatus}
//               </div>
//             </div>

//             {/* Title and Description */}
//             <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
//               <div className="mb-4 flex flex-wrap gap-2">
//                 <span className="rounded-full bg-[#E0EAFF] px-4 py-1.5 text-sm font-semibold text-[#2748A5]">
//                   {tuition.subject}
//                 </span>

//                 <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
//                   {tuition.mode}
//                 </span>
//               </div>

//               <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
//                 {tuition.title}
//               </h1>

//               <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//                 <MapPin size={17} />
//                 {tuition.location}
//               </p>

//               <div className="my-7 border-t border-slate-200 dark:border-slate-700" />

//               <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
//                 Tuition Description
//               </h2>

//               <p className="leading-8 text-slate-600 dark:text-slate-300">
//                 {tuition.description}
//               </p>
//             </section>

//             {/* Tuition Information */}
//             <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
//               <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
//                 Tuition Information
//               </h2>

//               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//                 {details.map((detail) => {
//                   const Icon = detail.icon;

//                   return (
//                     <div
//                       key={detail.label}
//                       className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50"
//                     >
//                       <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E0EAFF] text-[#4169E1]">
//                         <Icon size={21} />
//                       </div>

//                       <div>
//                         <p className="text-sm text-slate-500 dark:text-slate-400">
//                           {detail.label}
//                         </p>

//                         <p className="mt-1 font-semibold text-slate-900 dark:text-white">
//                           {detail.value}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>

//             {/* Tutor Information */}
//             <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
//               <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
//                 About the Tutor
//               </h2>

//               <div className="flex items-center gap-4">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E0EAFF] text-[#4169E1]">
//                   <UserRound size={32} />
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">
//                     {tuition.tutorName}
//                   </h3>

//                   <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                     Verified Tuition Provider
//                   </p>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Apply Sidebar */}
//           <aside>
//             <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
//               <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
//                 Monthly Tuition Fee
//               </p>

//               <p className="mt-2 text-3xl font-bold text-[#4169E1]">
//                 ৳{tuition.monthlyFee.toLocaleString("en-BD")}
//               </p>

//               <div className="my-6 border-t border-slate-200 dark:border-slate-700" />

//               <div className="space-y-4 text-sm">
//                 <div className="flex items-center justify-between">
//                   <span className="text-slate-500 dark:text-slate-400">
//                     Class
//                   </span>
//                   <span className="font-semibold text-slate-900 dark:text-white">
//                     {tuition.classLevel}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <span className="text-slate-500 dark:text-slate-400">
//                     Subject
//                   </span>
//                   <span className="font-semibold text-slate-900 dark:text-white">
//                     {tuition.subject}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <span className="text-slate-500 dark:text-slate-400">
//                     Weekly Schedule
//                   </span>
//                   <span className="font-semibold text-slate-900 dark:text-white">
//                     {tuition.daysPerWeek} Days
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <span className="text-slate-500 dark:text-slate-400">
//                     Mode
//                   </span>
//                   <span className="font-semibold text-slate-900 dark:text-white">
//                     {tuition.mode}
//                   </span>
//                 </div>
//               </div>

//               <div className="my-6 border-t border-slate-200 dark:border-slate-700" />

//               <Link
//                 href={`/sign-in?callbackUrl=/tuitions/${tuition._id}`}
//                 className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4169E1] px-5 py-3.5 font-semibold text-white transition hover:bg-[#2748A5]"
//               >
//                 Apply Now
//                 <ArrowRight size={18} />
//               </Link>

//               <p className="mt-4 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
//                 Sign in with your student account to apply for this tuition.
//               </p>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </main>
//   );
// }







import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  GraduationCap,
  MapPin,
  Monitor,
  BookOpen,
  UserRound,
  Wallet,
} from "lucide-react";
import { notFound } from "next/navigation";

import { getTuitionById } from "@/services/tuition.service";

interface TuitionDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TuitionDetailsPage({
  params,
}: TuitionDetailsPageProps) {
  const { id } = await params;

  let tuition;

  try {
    tuition = await getTuitionById(id);
  } catch {
    notFound();
  }

  if (!tuition) {
    notFound();
  }

  const details = [
    {
      label: "Subject",
      value: tuition.subject,
      icon: BookOpen,
    },
    {
      label: "Class Level",
      value: tuition.classLevel,
      icon: GraduationCap,
    },
    {
      label: "Location",
      value: tuition.location,
      icon: MapPin,
    },
    {
      label: "Learning Mode",
      value: tuition.mode,
      icon: Monitor,
    },
    {
      label: "Days Per Week",
      value: `${tuition.daysPerWeek} Days`,
      icon: CalendarDays,
    },
    {
      label: "Monthly Fee",
      value: `৳${tuition.monthlyFee.toLocaleString("en-BD")}`,
      icon: Wallet,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-10 dark:bg-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/tuitions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4169E1] transition hover:text-[#2748A5]"
        >
          <ArrowLeft size={18} />
          Back to All Tuitions
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Banner */}
            <div className="relative h-64 overflow-hidden rounded-2xl bg-[#E0EAFF] sm:h-80">
              {tuition.bannerImage ? (
                <Image
                  src={tuition.bannerImage}
                  alt={tuition.title}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <GraduationCap
                    size={80}
                    className="text-[#4169E1]"
                  />
                </div>
              )}

              <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#4169E1] shadow">
                {tuition.approvalStatus === "approved"
                  ? "Verified Tuition"
                  : tuition.approvalStatus}
              </div>
            </div>

            {/* Title and Description */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#E0EAFF] px-4 py-1.5 text-sm font-semibold text-[#2748A5]">
                  {tuition.subject}
                </span>

                <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
                  {tuition.mode}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                {tuition.title}
              </h1>

              <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin size={17} />
                {tuition.location}
              </p>

              <div className="my-7 border-t border-slate-200 dark:border-slate-700" />

              <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                Tuition Description
              </h2>

              <p className="leading-8 text-slate-600 dark:text-slate-300">
                {tuition.description}
              </p>
            </section>

            {/* Tuition Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                Tuition Information
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {details.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div
                      key={detail.label}
                      className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E0EAFF] text-[#4169E1]">
                        <Icon size={21} />
                      </div>

                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {detail.label}
                        </p>

                        <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Tutor Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                About the Tutor
              </h2>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E0EAFF] text-[#4169E1]">
                  <UserRound size={32} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {tuition.tutorName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Verified Tuition Provider
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Apply Sidebar */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Monthly Tuition Fee
              </p>

              <p className="mt-2 text-3xl font-bold text-[#4169E1]">
                ৳{tuition.monthlyFee.toLocaleString("en-BD")}
              </p>

              <div className="my-6 border-t border-slate-200 dark:border-slate-700" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Class
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {tuition.classLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Subject
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {tuition.subject}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Weekly Schedule
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {tuition.daysPerWeek} Days
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Mode
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {tuition.mode}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-slate-200 dark:border-slate-700" />

              {/* Apply Now Button */}
              <Link
                href={`/tuitions/${tuition._id}/apply`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4169E1] px-5 py-3.5 font-semibold text-white transition hover:bg-[#2748A5]"
              >
                Apply Now
                <ArrowRight size={18} />
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                Sign in with your student account to apply for this tuition.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}