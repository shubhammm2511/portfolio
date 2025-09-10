"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div className="bg-background text-foreground relative">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "work", "thoughts", "connect"].map((section) => (
            <button
              key={section}
              onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                activeSection === section ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <header id="intro" ref={(el) => (sectionsRef.current[0] = el)} className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full">
            <div className="lg:col-span-2 flex justify-center lg:justify-start order-first lg:order-last">
              <div className="relative">
                <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border border-border/50 bg-muted/20">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/professional-headshot-of-young-indian-computer-sci.jpg-6cGGz51iCMwLikxyYvaZHdNgia9EUP.jpeg"
                    alt="Shubham Kumar Tiwary"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">PORTFOLIO / 2025</div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight">
                  Shubham
                  <br />
                  <span className="text-muted-foreground">Kumar Tiwary</span>
                </h1>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Computer Science student specializing in
                  <span className="text-foreground"> Data Science</span> and
                  <span className="text-foreground"> Machine Learning</span>, with passion for
                  <span className="text-foreground"> web development</span>.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Open to opportunities
                  </div>
                  <div>India</div>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground font-mono">EDUCATION</div>
                  <div className="space-y-2">
                    <div className="text-foreground">BTech Computer Science</div>
                    <div className="text-muted-foreground">@ UPES</div>
                    <div className="text-xs text-muted-foreground">2022 — 2026 • CGPA: 7.7</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Machine Learning", "React", "JavaScript", "Data Science"].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="work" ref={(el) => (sectionsRef.current[1] = el)} className="py-20 sm:py-32">
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Experience & Projects</h2>
              <div className="text-sm text-muted-foreground font-mono">2023 — 2025</div>
            </div>

            <div className="space-y-2 mb-8">
              <h3 className="text-xl font-medium text-foreground">Professional Experience</h3>
              <div className="w-12 h-0.5 bg-foreground"></div>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  year: "2025",
                  role: "Project Intern",
                  company: "IBM Virtual Internship",
                  type: "Experience",
                  description:
                    "Spearheaded development of ML-based web application for loan risk prediction. Trained and evaluated multiple models achieving 82.4% accuracy with Random Forest. Deployed solution using Streamlit and Render for real-time predictions.",
                  tech: ["Python", "Scikit-learn", "Streamlit", "Render", "Machine Learning"],
                },
                {
                  year: "2023",
                  role: "Social & Technical Intern",
                  company: "Nanhi Kashtiyan NGO",
                  type: "Experience",
                  description:
                    "Designed educational and therapeutic solutions for children with autism. Developed tailored academic plans and contributed to community initiatives through donations and environmental activities.",
                  tech: ["Community Service", "Educational Design", "Social Impact"],
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {job.year}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h4 className="text-lg sm:text-xl font-medium">{job.role}</h4>
                      <div className="text-muted-foreground">{job.company}</div>
                      <div className="text-xs text-blue-500 font-mono mt-1">{job.type}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{job.description}</p>
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end mt-2 lg:mt-0">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-muted-foreground border border-border/30 rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mt-16 mb-8">
              <h3 className="text-xl font-medium text-foreground">Personal Projects</h3>
              <div className="w-12 h-0.5 bg-foreground"></div>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  year: "2025",
                  role: "MotoGo – Bike & Scooter Rental Platform",
                  company: "Ongoing Development",
                  type: "Project",
                  description:
                    "Full-stack rental platform for seamless urban mobility. Features vehicle browsing, real-time booking, secure transactions, and efficient fleet management for on-demand two-wheeler rentals.",
                  tech: ["Full-Stack", "Real-time Booking", "Fleet Management", "Urban Mobility"],
                },
                {
                  year: "2025",
                  role: "Credit Risk Classification Web Application",
                  company: "Machine Learning Project",
                  type: "Project",
                  description:
                    "Built ML-powered web application to classify loan applicants as Low/High Risk. Implemented multiple predictive models and achieved 82.4% accuracy with Random Forest algorithm.",
                  tech: ["Python", "XGBoost", "Random Forest", "Streamlit", "Machine Learning"],
                },
                {
                  year: "2025",
                  role: "Sentiment Analysis of Arabic Tweets",
                  company: "NLP Research Project",
                  type: "Project",
                  description:
                    "Developed Arabic tweet sentiment classifier using BERT variants and classical ML models. Preprocessed Arabic text with advanced NLP techniques achieving superior accuracy with transformers.",
                  tech: ["Python", "BERT", "PyTorch", "Hugging Face", "NLP"],
                },
                {
                  year: "2024",
                  role: "Smart Waste Food Management System",
                  company: "Full-Stack Project",
                  type: "Project",
                  description:
                    "A comprehensive web application aimed at reducing food wastage by connecting donors with people in need. Features real-time updates, user-friendly interface, and efficient donation workflow management promoting sustainability and social responsibility.",
                  tech: ["Full-Stack", "Real-time Updates", "Sustainability", "Web Development"],
                },
                {
                  year: "2024",
                  role: "ISP Automation System",
                  company: "Java Development Project",
                  type: "Project",
                  description:
                    "Built comprehensive automation system reducing manual administrative tasks and improving data accuracy. Features Java Swing GUI for customer management and MySQL integration.",
                  tech: ["Java", "Swing", "MySQL", "JDBC", "Automation"],
                },
              ].map((project, index) => (
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {project.year}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h4 className="text-lg sm:text-xl font-medium">{project.role}</h4>
                      <div className="text-muted-foreground">{project.company}</div>
                      <div className="text-xs text-green-500 font-mono mt-1">{project.type}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{project.description}</p>
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end mt-2 lg:mt-0">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-muted-foreground border border-border/30 rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="thoughts" ref={(el) => (sectionsRef.current[2] = el)} className="py-20 sm:py-32">
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light">Technical Skills</h2>

            <div className="space-y-12">
              {[
                {
                  title: "Programming Languages",
                  skills: ["C/C++", "Python", "JavaScript", "HTML", "CSS"],
                  color: "blue",
                },
                {
                  title: "Frameworks & Libraries",
                  skills: ["React", "Angular", "Bootstrap", "NumPy", "Pandas", "Scikit-learn"],
                  color: "green",
                },
                {
                  title: "Databases & Cloud",
                  skills: ["MongoDB", "Firebase", "MySQL", "JDBC"],
                  color: "purple",
                },
                {
                  title: "Data Science & Analytics",
                  skills: [
                    "Machine Learning",
                    "Deep Learning",
                    "Neural Networks",
                    "Statistical Analysis",
                    "Data Visualization",
                    "Data Mining",
                    "Power BI",
                    "Tableau",
                    "TensorFlow",
                    "PyTorch",
                    "Scikit-learn",
                    "NumPy",
                    "Pandas",
                    "Matplotlib",
                    "Seaborn",
                    "Jupyter Notebook",
                    "OpenCV",
                    "NLTK",
                    "Hugging Face",
                    "XGBoost",
                  ],
                  color: "orange",
                },
              ].map((category, index) => (
                <div key={index} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-medium text-foreground">{category.title}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className={`
                          group relative px-4 py-2 text-sm font-medium rounded-lg
                          border border-border/50 bg-background/50 backdrop-blur-sm
                          hover:border-${category.color}-500/50 hover:bg-${category.color}-500/5
                          hover:shadow-lg hover:shadow-${category.color}-500/10
                          transition-all duration-300 cursor-default
                          hover:-translate-y-0.5
                        `}
                      >
                        <span className="relative z-10 text-foreground group-hover:text-foreground">{skill}</span>
                        <div
                          className={`
                          absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                          bg-gradient-to-r from-${category.color}-500/10 to-${category.color}-600/5
                          transition-opacity duration-300
                        `}
                        ></div>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 rounded-2xl border border-border/50 bg-muted/20 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium text-foreground">Core Competencies</h3>
                  <p className="text-sm text-muted-foreground">Areas of expertise and ongoing development</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { skill: "Web Development", level: "Advanced", icon: "🌐" },
                    { skill: "Data Science", level: "Advanced", icon: "📊" },
                    { skill: "Machine Learning", level: "Advanced", icon: "🤖" },
                    { skill: "Problem Solving", level: "Advanced", icon: "🧩" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="text-center space-y-2 p-4 rounded-lg hover:bg-background/50 transition-colors duration-300"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="text-sm font-medium text-foreground">{item.skill}</div>
                      <div className="text-xs text-muted-foreground">{item.level}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="connect" ref={(el) => (sectionsRef.current[3] = el)} className="py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl font-light">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Open to internships, collaborations, and discussions about technology, data science, and software
                  development.
                </p>

                <div className="space-y-4">
                  <Link
                    href="mailto:shubhamtiwari2511@outlook.com"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-base sm:text-lg">shubhamtiwari2511@outlook.com</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  <Link
                    href="tel:+918236028933"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-base sm:text-lg">+91-8236028933</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="text-sm text-muted-foreground font-mono">ELSEWHERE</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="https://github.com/shubhammm2511"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <div className="space-y-1">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        GitHub
                      </div>
                      <div className="text-sm text-muted-foreground">@shubhammm2511</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="https://linkedin.com/in/shubham-kumar-tiwary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.564v11.452zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <div className="space-y-1">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        LinkedIn
                      </div>
                      <div className="text-sm text-muted-foreground">Professional Profile</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                      University
                    </div>
                    <div className="text-sm text-muted-foreground">UPES Student</div>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                      Roll No.
                    </div>
                    <div className="text-sm text-muted-foreground">R2142220661</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 sm:py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">© 2025 Shubham Kumar Tiwary. All rights reserved.</div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <button className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300">
                <svg
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
