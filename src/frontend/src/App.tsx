import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  ChevronDown,
  Code2,
  ExternalLink,
  FolderOpen,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Twitter,
  User,
  X,
} from "lucide-react";
import type { Variants } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Contact, Experience, Project } from "./backend.d";
import { useGetProfile } from "./hooks/useQueries";

// ── Sample fallback data ────────────────────────────────────────
const SAMPLE_PROFILE = {
  name: "Naveenkumar",
  title: "Full-Stack Engineer & Product Designer",
  tagline:
    "I craft digital experiences that are beautiful, fast, and meaningful.",
  bio: `I'm a full-stack engineer with 8 years of experience building products that scale. I believe the best software is the kind people don't think about — it just works, delights, and disappears into the background of their lives.

I've worked across fintech, healthtech, and developer tooling, shipping features used by millions. My work spans from product architecture down to pixel-perfect UI — because I think the best engineers care about the whole experience.

When I'm not coding, I write about engineering culture, mentor early-career developers, and obsessively hunt down the perfect cup of pour-over.`,
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "Rust",
    "PostgreSQL",
    "Redis",
    "AWS",
    "Kubernetes",
    "System Design",
    "GraphQL",
    "Figma",
    "Product Strategy",
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Vercel",
      duration: "2022 – Present",
      description:
        "Led development of the Edge Runtime, improving cold-start performance by 60%. Collaborated with platform teams to ship Next.js 13's App Router, adopted by 200k+ projects within 3 months.",
    },
    {
      role: "Software Engineer II",
      company: "Stripe",
      duration: "2019 – 2022",
      description:
        "Built core infrastructure for Stripe's payment routing engine, processing $500M+ daily volume. Designed the developer SDK used by 50k+ merchants globally.",
    },
    {
      role: "Frontend Engineer",
      company: "Figma",
      duration: "2017 – 2019",
      description:
        "Developed real-time collaboration features using CRDTs and WebSockets. Improved canvas rendering performance by 40% through GPU-accelerated compositing.",
    },
  ],
  projects: [
    {
      title: "Drift — Open Source State Manager",
      description:
        "A zero-dependency TypeScript state management library inspired by Zustand and Jotai. 2k+ GitHub stars, used in production by several YC-backed startups.",
      link: "https://github.com",
    },
    {
      title: "PromptLab",
      description:
        "A collaborative prompt engineering workbench for teams building LLM-powered applications. Ships with version control, A/B testing, and live evaluation.",
      link: "https://github.com",
    },
    {
      title: "Chronos CLI",
      description:
        "A terminal-based time tracking tool with automatic project detection and integrations with Linear, Jira, and GitHub. 800+ weekly active users.",
      link: "https://github.com",
    },
    {
      title: "Type Canvas",
      description:
        "A browser-based creative coding playground focused on generative typography. 150+ pieces shared by the community, featured in Smashing Magazine.",
    },
  ],
  contacts: [
    { platform: "Website", url: "https://naveenkumar.caffeine.xyz" },
    { platform: "GitHub", url: "https://github.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "Twitter", url: "https://twitter.com" },
    { platform: "Email", url: "mailto:hello@alexandra.dev" },
  ],
};

// ── Platform icon helper ──────────────────────────────────────
function PlatformIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Github className={className} />;
  if (p.includes("linkedin")) return <Linkedin className={className} />;
  if (p.includes("twitter") || p.includes("x.com"))
    return <Twitter className={className} />;
  if (p.includes("mail") || p.includes("email"))
    return <Mail className={className} />;
  return <Globe className={className} />;
}

// ── Nav links config ─────────────────────────────────────────
const NAV_LINKS = [
  { label: "About", href: "#about", icon: User },
  { label: "Skills", href: "#skills", icon: Code2 },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Projects", href: "#projects", icon: FolderOpen },
  { label: "Contact", href: "#contact", icon: MessageSquare },
];

// ── Stagger variants ─────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ── Loading Skeleton ──────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div data-ocid="profile.loading_state" className="min-h-screen">
      {/* Nav skeleton */}
      <div className="fixed top-0 w-full z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border" />

      {/* Hero skeleton */}
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-6">
          <Skeleton className="w-28 h-28 rounded-full" />
          <Skeleton className="w-64 h-10" />
          <Skeleton className="w-80 h-6" />
          <Skeleton className="w-96 h-5" />
          <Skeleton className="w-36 h-10 rounded-full" />
        </div>
      </div>

      {/* Section skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="py-20 px-6 max-w-5xl mx-auto">
          <Skeleton className="w-40 h-8 mb-3" />
          <Skeleton className="w-16 h-1 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((j) => (
              <Skeleton key={j} className="h-36 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────
function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <motion.div variants={itemVariants} className="mb-12">
      <div className="flex items-center gap-3 mb-3">
        <span className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-4 h-4" />
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          {label}
        </h2>
      </div>
      <div className="section-divider" />
    </motion.div>
  );
}

// ── Navbar ────────────────────────────────────────────────────
function Navbar({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Detect active section
      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / initials */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group"
            aria-label="Back to top"
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm tracking-wide group-hover:scale-105 transition-transform">
              {initials || "AC"}
            </div>
            <span className="hidden sm:block font-display font-semibold text-sm text-foreground/80 group-hover:text-foreground transition-colors">
              {name || "Portfolio"}
            </span>
          </a>

          {/* Desktop nav */}
          <ol className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link, idx) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-ocid={`nav.link.${idx + 1}`}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeSection === link.href.slice(1)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeSection === link.href.slice(1) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary/10 rounded-md"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              </li>
            ))}
          </ol>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border md:hidden"
          >
            <ol className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, idx) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-ocid={`nav.link.${idx + 1}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Hero Section ──────────────────────────────────────────────
function HeroSection({
  name,
  title,
  tagline,
}: {
  name: string;
  title: string;
  tagline: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise-bg"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url(/assets/generated/hero-bg.dim_1920x1080.jpg)",
        }}
        aria-hidden="true"
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.18 0.03 260 / 0.8) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background:
            "linear-gradient(to top, oklch(var(--background)), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Decorative orbs */}
      <div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.75 0.16 75)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.62 0.12 185)" }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar */}
        <motion.div variants={itemVariants} className="mb-8">
          <div
            className="w-28 h-28 rounded-2xl flex items-center justify-center text-3xl font-display font-bold text-primary-foreground relative"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.16 75), oklch(0.62 0.12 185))",
              boxShadow:
                "0 0 0 1px oklch(0.75 0.16 75 / 0.3), 0 20px 60px oklch(0.75 0.16 75 / 0.2)",
            }}
          >
            {initials || "AC"}
          </div>
        </motion.div>

        {/* Status badge */}
        <motion.div variants={itemVariants} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Available for opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
        >
          <span className="text-gradient">{name || "Your Name"}</span>
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-muted-foreground font-medium mb-5"
        >
          {title || "Software Engineer"}
        </motion.p>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-10 max-w-xl"
        >
          {tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            data-ocid="hero.primary_button"
            className="rounded-full px-8 font-semibold text-sm gap-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.75 0.16 75), oklch(0.65 0.14 75))",
              color: "oklch(0.1 0.008 260)",
              boxShadow: "0 4px 20px oklch(0.75 0.16 75 / 0.35)",
            }}
          >
            <a href="#projects">
              View My Work
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 font-semibold text-sm border-border hover:border-primary/50"
          >
            <a href="#contact">Get in Touch</a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-xs font-medium tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── About Section ─────────────────────────────────────────────
function AboutSection({ bio }: { bio: string }) {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionHeading icon={User} label="About Me" />

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-5 gap-10 items-start"
          >
            {/* Bio text */}
            <div className="md:col-span-3">
              {bio.split("\n\n").map((para) => (
                <p
                  key={para.slice(0, 40)}
                  className="text-base md:text-lg text-foreground/80 leading-relaxed mb-5 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Decorative sidebar */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2.5 text-muted-foreground text-sm mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground text-sm mb-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>8+ years experience</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Open to new roles</span>
                </div>
              </div>

              <div
                className="p-5 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.16 75 / 0.08), oklch(0.62 0.12 185 / 0.08))",
                  border: "1px solid oklch(0.75 0.16 75 / 0.15)",
                }}
              >
                <p className="text-sm text-foreground/70 italic leading-relaxed">
                  "The best engineers don't just write code — they solve
                  problems and craft experiences."
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Skills Section ────────────────────────────────────────────
function SkillsSection({ skills }: { skills: string[] }) {
  const displaySkills = skills.length > 0 ? skills : SAMPLE_PROFILE.skills;

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionHeading icon={Code2} label="Skills & Technologies" />

          <motion.div
            variants={containerVariants}
            className="flex flex-wrap gap-3"
          >
            {displaySkills.map((skill, idx) => (
              <motion.div
                key={skill}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Badge
                  data-ocid={`skills.item.${idx + 1}`}
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium cursor-default select-none"
                  style={{
                    background: `oklch(0.18 0.02 ${200 + ((idx * 37) % 120)} / 0.8)`,
                    border: `1px solid oklch(0.35 0.04 ${200 + ((idx * 37) % 120)} / 0.4)`,
                    color: `oklch(0.82 0.06 ${200 + ((idx * 37) % 120)})`,
                  }}
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Experience Section ────────────────────────────────────────
function ExperienceSection({ experience }: { experience: Experience[] }) {
  const displayExp =
    experience.length > 0 ? experience : SAMPLE_PROFILE.experience;

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionHeading icon={Briefcase} label="Experience" />

          <div className="relative timeline-line pl-10">
            {displayExp.map((exp, idx) => (
              <motion.div
                key={`${exp.company}-${exp.role}`}
                data-ocid={`experience.item.${idx + 1}`}
                variants={itemVariants}
                className="relative mb-8 last:mb-0"
              >
                {/* Timeline dot */}
                <div
                  className="absolute -left-10 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    background: "oklch(var(--background))",
                    borderColor: "oklch(var(--primary))",
                    boxShadow: "0 0 12px oklch(0.75 0.16 75 / 0.4)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>

                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-medium text-primary mt-0.5">
                        {exp.company}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {exp.duration}
                    </span>
                  </div>
                  <Separator className="mb-3 opacity-50" />
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {exp.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Projects Section ──────────────────────────────────────────
function ProjectsSection({ projects }: { projects: Project[] }) {
  const displayProjects =
    projects.length > 0 ? projects : SAMPLE_PROFILE.projects;

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionHeading icon={FolderOpen} label="Projects" />

          <motion.div
            variants={containerVariants}
            className="grid sm:grid-cols-2 gap-5"
          >
            {displayProjects.map((project, idx) => (
              <motion.div
                key={project.title}
                data-ocid={`projects.item.${idx + 1}`}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 flex flex-col gap-4 transition-colors"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `oklch(${0.2 + ((idx * 0.05) % 0.1)} ${0.04 + ((idx * 0.02) % 0.08)} ${200 + ((idx * 40) % 120)})`,
                    }}
                  >
                    <FolderOpen className="w-4 h-4 text-primary" />
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      aria-label={`Visit ${project.title}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-foreground/65 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Link CTA */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline mt-auto"
                  >
                    View Project
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Contact Section ───────────────────────────────────────────
function ContactSection({
  contacts,
  name,
}: {
  contacts: Contact[];
  name: string;
}) {
  const displayContacts =
    contacts.length > 0 ? contacts : SAMPLE_PROFILE.contacts;

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionHeading icon={MessageSquare} label="Get In Touch" />

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="font-display text-2xl font-semibold mb-4">
                Let's work together
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-6">
                I'm always open to discussing new opportunities, interesting
                projects, or just having a great conversation. My inbox is
                always open.
              </p>

              <div className="flex flex-wrap gap-3">
                {displayContacts.map((contact, idx) => (
                  <motion.a
                    key={contact.platform}
                    href={contact.url}
                    data-ocid={`contact.item.${idx + 1}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-card/80 text-sm font-medium text-foreground/80 hover:text-foreground transition-all"
                  >
                    <PlatformIcon
                      platform={contact.platform}
                      className="w-4 h-4 text-primary"
                    />
                    {contact.platform}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Decorative element */}
            <motion.div
              variants={itemVariants}
              className="hidden md:flex items-center justify-center"
            >
              <div
                className="relative w-56 h-56 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.16 75 / 0.05), oklch(0.62 0.12 185 / 0.1))",
                  border: "1px solid oklch(0.75 0.16 75 / 0.12)",
                }}
              >
                <div
                  className="absolute inset-4 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.16 75 / 0.08), oklch(0.62 0.12 185 / 0.12))",
                    border: "1px solid oklch(0.62 0.12 185 / 0.15)",
                  }}
                >
                  <div className="text-center">
                    <MessageSquare className="w-10 h-10 text-primary mx-auto mb-2 opacity-60" />
                    <p className="text-xs text-muted-foreground font-medium">
                      {name ? name.split(" ")[0] : "Me"}'s Inbox
                    </p>
                    <p className="text-xs text-primary font-semibold mt-1">
                      Always open
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer({ name }: { name: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          © {year}{" "}
          <span className="text-foreground font-medium">
            {name || "Portfolio"}
          </span>
          . All rights reserved.
        </p>
        <p>
          Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const { data, isLoading } = useGetProfile();

  // Merge backend data with sample fallback for empty fields
  const profile = {
    name: data?.name || SAMPLE_PROFILE.name,
    title: data?.title || SAMPLE_PROFILE.title,
    tagline: data?.tagline || SAMPLE_PROFILE.tagline,
    bio: data?.bio || SAMPLE_PROFILE.bio,
    skills: data?.skills?.length ? data.skills : SAMPLE_PROFILE.skills,
    experience: data?.experience?.length
      ? data.experience
      : SAMPLE_PROFILE.experience,
    projects: data?.projects?.length ? data.projects : SAMPLE_PROFILE.projects,
    contacts: data?.contacts?.length ? data.contacts : SAMPLE_PROFILE.contacts,
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar name={profile.name} />

      <main>
        <HeroSection
          name={profile.name}
          title={profile.title}
          tagline={profile.tagline}
        />

        <div className="max-w-none">
          <AboutSection bio={profile.bio} />

          <div
            className="h-px max-w-5xl mx-auto"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(var(--border)), transparent)",
            }}
          />

          <SkillsSection skills={profile.skills} />

          <div
            className="h-px max-w-5xl mx-auto"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(var(--border)), transparent)",
            }}
          />

          <ExperienceSection experience={profile.experience} />

          <div
            className="h-px max-w-5xl mx-auto"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(var(--border)), transparent)",
            }}
          />

          <ProjectsSection projects={profile.projects} />

          <div
            className="h-px max-w-5xl mx-auto"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(var(--border)), transparent)",
            }}
          />

          <ContactSection contacts={profile.contacts} name={profile.name} />
        </div>
      </main>

      <Footer name={profile.name} />
    </div>
  );
}
