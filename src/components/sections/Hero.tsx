'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { RiDribbbleLine } from 'react-icons/ri'
import { useState, useEffect, useMemo } from 'react'
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"
import type { Container, Engine } from "tsparticles-engine"
import { useTheme } from 'next-themes'

interface Hero {
  _id: string
  title: string
  subtitle: string
  description: string
  phrases: string[]
  ctaButtons: {
    label: string
    href: string
  }[]
  animationSpeed: number
  animationDelay: number
  socialLinks?: {
    github?: string
    linkedin?: string
    dribbble?: string
  }
}

const Hero = () => {
  const [hero, setHero] = useState<Hero | null>(null)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()

  const particlesOptions = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 150,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: theme === 'light' ? "#000000" : "#ffffff",
      },
      links: {
        color: theme === 'light' ? "#000000" : "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 0.5,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "bounce" as const,
        },
        random: true,
        speed: 0.8,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 1000,
        },
        value: 100,
      },
      opacity: {
        value: 0.1,
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.1,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  }), [theme])

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine)
  }

  const particlesLoaded = async (container: Container | undefined) => {
    // console.log(container)
  }

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch('/api/hero')
        const data = await res.json()
        setHero(data[0] || null)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching hero:', error)
        setIsLoading(false)
      }
    }

    fetchHero()
  }, [])

  useEffect(() => {
    if (!hero || !hero.phrases || hero.phrases.length <= 1) return

    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % hero.phrases.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [hero])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants = {
    initial: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
      }
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const letterVariants = {
    initial: {
      opacity: 0,
      y: 50,
      rotateX: -90
    },
    animate: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      rotateX: 90,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary dark:bg-white">
        <div className="w-8 h-8 border-4 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!hero) {
    return null
  }

  return (
    <section className="relative min-h-screen flex items-center bg-secondary dark:bg-white overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-white/5 dark:from-white dark:via-white/90 dark:to-gray-900/5 z-10" />
      
      <Particles
        className="absolute inset-0"
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/80 dark:text-gray-900/80 font-semibold mb-4 lg:mb-6 block text-base lg:text-lg tracking-wide"
            >
              {hero.subtitle}
            </motion.span>

            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-gray-900 mb-4 lg:mb-6 leading-[1.2]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {hero.title}
            </motion.h1>

            <div className="h-16 sm:h-20 lg:h-24 mb-6 lg:mb-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPhrase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg sm:text-xl lg:text-2xl text-white/80 dark:text-gray-900/80"
                >
                  {hero.phrases[currentPhrase]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-4 mb-12">
              {hero.ctaButtons.map((button, index) => (
                <motion.a
                  key={button.label}
                  href={button.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative inline-flex items-center gap-2 px-8 py-4 ${
                    index === 0 
                      ? 'bg-white dark:bg-gray-900 text-black dark:text-white hover:text-white dark:hover:text-gray-900' 
                      : 'bg-transparent text-white dark:text-gray-900 border-2 border-white dark:border-gray-900 hover:bg-white dark:hover:bg-gray-900 hover:text-black dark:hover:text-white'
                  } font-semibold rounded-full overflow-hidden transition-all duration-300`}
                >
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-[-4px]">
                    {button.label}
                  </span>
                  <FiArrowRight 
                    className="relative z-10 w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" 
                  />
                  <div 
                    className={`absolute inset-0 ${
                      index === 0
                        ? 'bg-black dark:bg-white'
                        : 'bg-white dark:bg-gray-900'
                    } translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out`}
                  />
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex items-center gap-6"
            >
              {hero.socialLinks?.github && (
                <a
                  href={hero.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 dark:text-gray-900/70 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
                >
                  <FiGithub className="w-6 h-6" />
                </a>
              )}
              {hero.socialLinks?.linkedin && (
                <a
                  href={hero.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 dark:text-gray-900/70 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
                >
                  <FiLinkedin className="w-6 h-6" />
                </a>
              )}
              {hero.socialLinks?.dribbble && (
                <a
                  href={hero.socialLinks.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 dark:text-gray-900/70 hover:text-white dark:hover:text-gray-900 transition-colors duration-300"
                >
                  <RiDribbbleLine className="w-6 h-6" />
                </a>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-gray-900/20 to-transparent rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-gradient-to-tr from-white/15 dark:from-gray-900/15 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-8 bg-gradient-to-tl from-white/10 dark:from-gray-900/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/20 dark:border-gray-900/20 rounded-full p-1">
          <div className="w-1.5 h-1.5 bg-white dark:bg-gray-900 rounded-full animate-bounce mx-auto" />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero 