import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  ShieldCheck,
  Target,
  HeartHandshake,
  Sparkles,
  Search,
  UserCheck,
  CreditCard,
  MessageCircle,
  CheckCircle2,
  Lightbulb,
  Award,
  Globe2,
  BookMarked,
} from "lucide-react";

import {
  ScrollReveal,
  RevealImage,
} from "@/components/about/scroll-reveal";

const features = [
  {
    icon: Search,
    title: "Easy Tutor Discovery",
    description:
      "Find suitable tutors based on subject, class level, location, and your learning requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Platform",
    description:
      "Explore tutor profiles and tuition information through a structured and transparent platform.",
  },
  {
    icon: HeartHandshake,
    title: "Direct Connection",
    description:
      "Connect students and tutors through a convenient application process.",
  },
  {
    icon: CreditCard,
    title: "Flexible Membership",
    description:
      "Choose a membership plan that matches your needs and unlock additional platform benefits.",
  },
  {
    icon: UserCheck,
    title: "Personalized Experience",
    description:
      "Enjoy separate dashboards designed for students, tutors, and administrators.",
  },
  {
    icon: Globe2,
    title: "Accessible Learning",
    description:
      "Discover tuition opportunities and learning support from different locations.",
  },
];

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Explore Tuitions",
    description:
      "Students browse available tuition posts and find opportunities that match their requirements.",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Create an Account",
    description:
      "Register as a student or tutor to access personalized features and your own dashboard.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Connect & Apply",
    description:
      "Students apply for suitable tuition opportunities, while tutors manage applications.",
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "Start Learning",
    description:
      "Build meaningful learning connections and move forward toward educational goals.",
  },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Our mission is to make finding the right tutor easier for students and help tutors discover suitable teaching opportunities through a simple and accessible platform.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description:
      "We envision a learning community where students can access quality educational support and tutors can share their knowledge with learners who need it.",
  },
  {
    icon: HeartHandshake,
    title: "Our Commitment",
    description:
      "We are committed to creating a user-friendly, transparent, and reliable environment that supports meaningful connections between students and tutors.",
  },
];

const studentBenefits = [
  "Browse available tuition opportunities",
  "Search and filter by your requirements",
  "Save interesting tuition posts",
  "Apply for suitable tuition opportunities",
  "Track applications and payment history",
];

const tutorBenefits = [
  "Create and publish tuition posts",
  "Manage your tuition listings",
  "Edit and update tuition information",
  "Review and manage student applications",
  "Track membership and payment history",
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#4169E1]/10 via-background to-[#4169E1]/5" />

        <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[#4169E1]/10 blur-3xl" />

        <div className="container mx-auto px-4 py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4169E1]/20 bg-[#4169E1]/10 px-4 py-2 text-sm font-semibold text-[#4169E1]">
                <Sparkles size={16} />
                About MentorLagbe
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Connecting Students with
                <span className="mt-2 block text-[#4169E1]">
                  the Right Tutors
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                MentorLagbe is a platform designed to make finding tutors and
                discovering teaching opportunities easier. We bring students
                and tutors together through a simple, organized, and convenient
                experience.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/tuitions"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4169E1] px-7 text-sm font-semibold text-white shadow-lg shadow-[#4169E1]/20 transition-all hover:-translate-y-0.5 hover:bg-[#2748A5]"
                >
                  Find a Tutor
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-7 text-sm font-semibold text-foreground transition-colors hover:border-[#4169E1] hover:text-[#4169E1]"
                >
                  Join MentorLagbe
                  <Users size={18} />
                </Link>
              </div>
            </ScrollReveal>

            <RevealImage
             src="https://images.unsplash.com/photo-1758270705031-ebd46917a454?auto=format&fit=crop&w=1200&q=85"
             alt="Students learning together"
             className="mx-auto mt-14 h-[260px] w-full max-w-4xl shadow-2xl sm:h-[380px] lg:h-[460px]"
             direction="up"
            />

            <ScrollReveal direction="up">
              <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur">
                  <GraduationCap
                    className="mx-auto mb-3 text-[#4169E1]"
                    size={30}
                  />
                  <h3 className="font-bold text-foreground">For Students</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Discover learning opportunities
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur">
                  <BookOpen
                    className="mx-auto mb-3 text-[#4169E1]"
                    size={30}
                  />
                  <h3 className="font-bold text-foreground">For Tutors</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Find teaching opportunities
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur">
                  <HeartHandshake
                    className="mx-auto mb-3 text-[#4169E1]"
                    size={30}
                  />
                  <h3 className="font-bold text-foreground">For Everyone</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Build learning connections
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal direction="left">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#4169E1]/10 px-4 py-2 text-sm font-semibold text-[#4169E1]">
                <BookMarked size={16} />
                Who We Are
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Making Education Connections
                <span className="text-[#4169E1]"> Simpler</span>
              </h2>

              <p className="mt-6 leading-8 text-muted-foreground">
                Finding the right tutor can be challenging, and discovering
                suitable teaching opportunities can take time. MentorLagbe aims
                to make this process easier by bringing both sides together in
                one organized platform.
              </p>

              <p className="mt-4 leading-8 text-muted-foreground">
                Students can explore tuition posts, save interesting
                opportunities, and submit applications. Tutors can create
                tuition posts, manage their listings, and review applications
                through their personalized dashboard.
              </p>

              <p className="mt-4 leading-8 text-muted-foreground">
                Whether you are looking for academic support or an opportunity
                to teach, MentorLagbe helps you take the next step.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
           <RevealImage
                 src="https://images.unsplash.com/photo-1758685733926-00cba008215b?auto=format&fit=crop&fm=jpg&q=85&w=1200"
                 alt="Teacher helping a young student with math problems"
                 className="h-[280px] w-full shadow-xl sm:h-[350px]"
                 direction="right"
            />

            <ScrollReveal direction="up" delay={150}>
              <div className="rounded-3xl bg-gradient-to-br from-[#4169E1] to-[#2748A5] p-7 text-white shadow-xl sm:p-9">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  <GraduationCap size={32} />
                </div>

                <h3 className="text-2xl font-bold">
                  Learning Begins with the Right Connection.
                </h3>

                <p className="mt-4 leading-8 text-blue-100">
                  Every student deserves an opportunity to learn, and every
                  passionate tutor deserves an opportunity to teach.
                  MentorLagbe brings these opportunities closer together.
                </p>

                <div className="mt-7 flex items-center gap-3 border-t border-white/20 pt-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                    <Award size={23} />
                  </div>

                  <div>
                    <p className="font-semibold">Learn. Teach. Grow.</p>
                    <p className="text-sm text-blue-100">
                      Together with MentorLagbe
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="border-y border-border bg-muted/30 py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-[#4169E1]">
                What Drives Us
              </span>

              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                Our Mission, Vision & Values
              </h2>

              <p className="mt-4 leading-7 text-muted-foreground">
                Everything we do is focused on making educational connections
                more accessible and convenient.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((item, index) => {
              const Icon = item.icon;

              return (
                <ScrollReveal
                  key={item.title}
                  direction="up"
                  delay={index * 120}
                >
                  <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4169E1]/40 hover:shadow-xl">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4169E1]/10 text-[#4169E1]">
                      <Icon size={28} />
                    </div>

                    <h3 className="text-xl font-bold text-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-20 lg:py-24">
        <ScrollReveal direction="up">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#4169E1]">
              Why MentorLagbe
            </span>

            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need in One Place
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              We provide useful tools and features to make the tutoring
              experience easier for students and tutors.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <ScrollReveal
                key={feature.title}
                direction="up"
                delay={index * 100}
              >
                <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#4169E1]/40 hover:shadow-lg">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4169E1]/10 text-[#4169E1] transition-colors group-hover:bg-[#4169E1] group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-muted/30 py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-[#4169E1]">
                Simple Process
              </span>

              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                How MentorLagbe Works
              </h2>

              <p className="mt-4 leading-7 text-muted-foreground">
                Getting started is simple. Follow these steps to discover
                opportunities and connect with the right people.
              </p>
            </div>
          </ScrollReveal>

          <RevealImage
            src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=85"
            alt="Teacher guiding students in a classroom"
            className="mx-auto mb-12 h-[260px] max-w-4xl shadow-xl sm:h-[350px]"
            direction="up"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <ScrollReveal
                  key={step.number}
                  direction="up"
                  delay={index * 120}
                >
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4169E1]/40 hover:shadow-lg">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4169E1]/10 text-[#4169E1]">
                        <Icon size={24} />
                      </div>

                      <span className="text-3xl font-extrabold text-[#4169E1]/20">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student and Tutor Benefits */}
      <section className="container mx-auto px-4 py-20 lg:py-24">
        <ScrollReveal direction="up">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#4169E1]">
              Made for You
            </span>

            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              A Platform for Both Sides
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Student Card */}
          <ScrollReveal direction="left">
            <div className="h-full rounded-3xl border border-[#4169E1]/20 bg-gradient-to-br from-[#4169E1]/10 to-transparent p-6 sm:p-10">
              <RevealImage
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=85"
                alt="Student studying with books"
                className="mb-7 h-56 w-full"
                direction="up"
              />

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4169E1] text-white">
                <GraduationCap size={30} />
              </div>

              <h3 className="text-2xl font-bold text-foreground">
                For Students
              </h3>

              <p className="mt-3 leading-7 text-muted-foreground">
                Find suitable tutors and manage your learning journey from one
                convenient dashboard.
              </p>

              <ul className="mt-7 space-y-4">
                {studentBenefits.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-[#4169E1]"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/tuitions"
                className="mt-9 inline-flex items-center gap-2 text-sm font-bold text-[#4169E1] transition-all hover:gap-3"
              >
                Explore Tuitions
                <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>

          {/* Tutor Card */}
          <ScrollReveal direction="right">
            <div className="h-full rounded-3xl border border-[#4169E1]/20 bg-gradient-to-br from-[#2748A5]/10 to-transparent p-6 sm:p-10">
              <RevealImage
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=85"
                alt="Teacher teaching students"
                className="mb-7 h-56 w-full"
                direction="up"
              />

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2748A5] text-white">
                <BookOpen size={28} />
              </div>

              <h3 className="text-2xl font-bold text-foreground">
                For Tutors
              </h3>

              <p className="mt-3 leading-7 text-muted-foreground">
                Share your knowledge, publish tuition opportunities, and
                manage your teaching activities with ease.
              </p>

              <ul className="mt-7 space-y-4">
                {tutorBenefits.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-[#4169E1]"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className="mt-9 inline-flex items-center gap-2 text-sm font-bold text-[#4169E1] transition-all hover:gap-3"
              >
                Become a Tutor
                <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 pb-20 lg:pb-24">
        <ScrollReveal direction="up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4169E1] to-[#2748A5] px-6 py-14 text-center text-white shadow-xl sm:px-12 sm:py-16">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
            <div className="absolute -bottom-28 -right-10 h-72 w-72 rounded-full border-[35px] border-white/10" />

            <div className="relative mx-auto max-w-2xl">
              <Sparkles className="mx-auto mb-5" size={34} />

              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Ready to Start Your Journey?
              </h2>

              <p className="mt-5 leading-8 text-blue-100">
                Join MentorLagbe today and take the next step toward better
                learning opportunities and meaningful teaching connections.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-bold text-[#2748A5] transition-all hover:bg-blue-50"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/tuitions"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/40 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Explore Tuitions
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}