"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowRight, 
  Briefcase, 
  Zap, 
  Sparkles,
  ChevronDown,
  Palette,
  Code,
  Rocket,
  CheckCircle,
  LayoutTemplate,
  ShoppingCart,
  MousePointer,
  Package,
  Bot,
  Moon,
  Sun
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GridPattern from "@/components/magicui/GridPattern";
import { WordRotate } from "@/components/magicui/WordRotate";
import { AuroraText } from "@/components/magicui/aurora-text";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useTheme } from "@/lib/theme-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const leftColumnVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const processStepVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const benefitCardVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
    scale: 0.8,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const iconVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -180,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.8,
      duration: 0.5,
      ease: "backOut",
    },
  },
};

const titleVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.4,
    },
  },
};

const textVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const processSteps = [
  {
    icon: Palette,
    title: "Design",
    description: "We create stunning, user-focused designs tailored to your brand and goals.",
    step: "01",
  },
  {
    icon: Code,
    title: "Develop",
    description: "Our expert developers bring your design to life with clean, efficient code.",
    step: "02", 
  },
  {
    icon: Rocket,
    title: "Deploy",
    description: "We launch your website and ensure everything runs smoothly from day one.",
    step: "03",
  },
];

// TypeWriter component for text animation
const TypeWriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.1 }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + index * 0.02,
            duration: 0.1,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const benefits = [
  {
    icon: Code,
    title: "Next.js Development",
    description: {
      intro: "Beautiful business websites with powerful integrations and advanced functionality. Scale into full platforms with AI features like chatbots and virtual consultants.",
      features: [
        "Unlimited integrations with any business tool",
        "AI chatbots & virtual consultants built-in",
        "Transform into full business platforms",
        "Advanced functionality & custom features",
        "Example: Customer portals with AI support",
        "Example: Booking systems with smart automation"
      ]
    },
    brandColor: "text-slate-400",
    brandBg: "bg-slate-500/15",
    brandBorder: "border-slate-500/30",
    ctaText: "Build Your Platform",
    buttonIcon: Rocket,
  },
  {
    icon: LayoutTemplate,
    title: "Platform Websites",
    description: {
      intro: "We build on any platform you're familiar with - Wix, WordPress, or others. Perfect if you want to edit content yourself or have experience with these tools.",
      features: [
        "Wix, WordPress, or your preferred platform",
        "You can edit content yourself after launch",
        "Built on platforms you already know",
        "Quick setup if you're familiar with the tools",
        "Example: WordPress sites for experienced users",
        "Example: Wix sites for easy self-editing"
      ]
    },
    brandColor: "text-blue-400",
    brandBg: "bg-blue-500/15",
    brandBorder: "border-blue-500/30",
    ctaText: "Choose Your Platform",
    buttonIcon: MousePointer,
  },
  {
    icon: ShoppingCart,
    title: "Shopify Stores",
    description: {
      intro: "E-commerce platforms designed to maximize conversions and sales, for businesses of all sizes looking to sell products online effectively.",
      features: [
        "Payment processing ready for immediate sales",
        "Inventory management to track stock levels",
        "Custom themes & apps for unique branding",
        "Example: Fashion & clothing online stores",
        "Example: Electronics & gadget shops",
        "Example: Local food & grocery delivery"
      ]
    },
    brandColor: "text-green-400",
    brandBg: "bg-green-500/15",
    brandBorder: "border-green-500/30",
    ctaText: "Launch Your Store",
    buttonIcon: Package,
  },
  {
    icon: Zap,
    title: "Workflow Automations",
    description: {
      intro: "Automate any business process with any app you can think of. From lead generation to email/SMS campaigns and everything in between.",
      features: [
        "Connect any app or tool you use",
        "Lead generation to CRM automation",
        "Email & SMS campaign automation",
        "Social media, scheduling, and more",
        "Example: Website leads → CRM → Email sequence",
        "Example: New sale → SMS notification → Inventory update"
      ]
    },
    brandColor: "text-orange-400",
    brandBg: "bg-orange-500/15",
    brandBorder: "border-orange-500/30",
    ctaText: "Automate Everything",
    buttonIcon: Bot,
  },
];

// Individual card component with scroll trigger
const BenefitCard = ({ benefit, index }: { benefit: typeof benefits[0], index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const direction = index % 2 === 0 ? -1 : 1; // Alternating left/right
  const { theme } = useTheme();

  return (
    <motion.div
      ref={cardRef}
      custom={direction}
      variants={benefitCardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative"
    >
      <Card className={`h-full backdrop-blur-md rounded-xl shadow-xl hover:border-orange-500/60 hover:shadow-[0_0_40px_-10px_theme(colors.orange.500/0.5)] transition-all duration-300 flex flex-col overflow-hidden group/benefitcard ${
        theme === 'light'
          ? 'bg-white/80 border border-slate-200/60 hover:shadow-orange-500/10'
          : 'bg-neutral-850/80 border border-neutral-700/80'
      }`}>
        <CardHeader className={`p-6 pb-4 border-b ${
          theme === 'light' ? 'border-slate-200/50' : 'border-neutral-700/50'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className={`flex-shrink-0 p-3.5 ${benefit.brandBg} border ${benefit.brandBorder} rounded-lg group-hover/benefitcard:scale-105 transition-transform duration-300`}
              variants={iconVariants}
            >
              <benefit.icon className={`w-8 h-8 ${benefit.brandColor}`} />
            </motion.div>
            <motion.div variants={titleVariants}>
              <CardTitle className={`text-2xl xl:text-3xl font-semibold ${
                theme === 'light' ? 'text-slate-900' : 'text-slate-100'
              }`}>
                <TypeWriter text={benefit.title} delay={0.3} />
              </CardTitle>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-5 flex-grow flex flex-col">
          <motion.div className="space-y-4 flex-grow" variants={textVariants}>
            <p className={`text-base md:text-lg leading-relaxed mb-6 ${
              theme === 'light' ? 'text-slate-700' : 'text-slate-200'
            }`}>
              <TypeWriter text={benefit.description.intro} delay={0.5} />
            </p>
            <motion.ul
              className={`text-sm space-y-3 ${
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 1.2,
                  },
                },
              }}
            >
              {benefit.description.features.map((feature, featureIndex) => {
                const isExample = feature.toLowerCase().startsWith("example:");
                return (
                  <motion.li key={featureIndex} variants={listItemVariants} className="flex items-start">
                    {isExample ? (
                      <CheckCircle className="w-4 h-4 mr-2.5 mt-[3px] text-green-400 flex-shrink-0" />
                    ) : (
                      <span className="mr-2.5 mt-1 text-orange-500 flex-shrink-0">•</span>
                    )}
                    <div className={isExample 
                      ? theme === 'light' ? 'text-slate-600' : 'text-slate-400' 
                      : theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                    }>
                      {isExample ? (
                        <>
                          <span className="font-semibold text-green-500">{feature.substring(0, feature.indexOf(':') + 1)}</span>
                          <span className="italic">{feature.substring(feature.indexOf(':') + 1)}</span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{feature.split(':')[0]}</span>
                          {feature.includes(':') ? (
                            <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-400'}>
                              {':' + feature.slice(feature.indexOf(':') + 1)}
                            </span>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
          <motion.div className="mt-auto pt-8" variants={itemVariants}>
            <Button
              variant="outline"
              className={`w-full group font-semibold transition-all duration-200 py-3 text-base rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.02] flex items-center justify-center border-2 ${
                benefit.brandColor === 'text-slate-400'
                  ? theme === 'light'
                    ? 'border-slate-400 text-slate-600 hover:bg-slate-50 hover:border-slate-500'
                    : 'border-slate-500 text-slate-400 hover:bg-slate-500/20 hover:border-slate-400'
                  : benefit.brandColor === 'text-blue-400'
                    ? theme === 'light'
                      ? 'border-blue-400 text-blue-600 hover:bg-blue-50 hover:border-blue-500'
                      : 'border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400'
                    : benefit.brandColor === 'text-green-400'
                      ? theme === 'light'
                        ? 'border-green-400 text-green-600 hover:bg-green-50 hover:border-green-500'
                        : 'border-green-500 text-green-400 hover:bg-green-500/20 hover:border-green-400'
                      : theme === 'light'
                        ? 'border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500'
                        : 'border-orange-500 text-orange-400 hover:bg-orange-500/20 hover:border-orange-400'
              }`}
            >
              <benefit.buttonIcon className={`w-5 h-5 mr-2`} />
              {benefit.ctaText}
              <ArrowRight className="w-5 h-5 ml-auto transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function HeroSection() {
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const processRef = useRef(null);
  const isProcessInView = useInView(processRef, { once: true, margin: "-100px" });
  const { theme, toggleTheme } = useTheme();

  // Sequential BorderBeam animation for process steps
  useEffect(() => {
    if (!isProcessInView) return;

    const interval = setInterval(() => {
      setActiveProcessStep((prev) => (prev + 1) % processSteps.length);
    }, 3000); // 3 seconds per step

    return () => clearInterval(interval);
  }, [isProcessInView]);

  return (
    <motion.section
      className={`relative w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-20 md:py-24 overflow-hidden isolate ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900' 
          : 'bg-[#0A0A0A] text-slate-100'
      }`}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <GridPattern
        width={50}
        height={50}
        x={-1}
        y={-1}
        className={
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] " +
          `fixed inset-0 z-0 ${
            theme === 'light' 
              ? 'stroke-slate-300/50 fill-slate-200/30' 
              : 'stroke-neutral-700/50 fill-neutral-800/30'
          }`
        }
      />
      
      {/* Main Hero Content - Centered */}
      <div className="container mx-auto z-10 max-w-4xl text-center space-y-8 md:space-y-12">
        
        {/* Header Section */}
        <motion.div 
          className="flex flex-col items-center space-y-6 md:space-y-8"
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className={`relative w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500/60 shadow-lg flex items-center justify-center ${
              theme === 'light' 
                ? 'bg-orange-50/80 shadow-orange-200/60' 
                : 'bg-orange-950/60 shadow-orange-900/60'
            }`}>
              <span 
                className="text-2xl leading-none"
                style={{
                  fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "EmojiSymbols", "EmojiOne Mozilla", "Twemoji Mozilla", "Segoe UI Symbol", "Noto Emoji", emoji',
                  fontSize: '24px',
                  lineHeight: '1',
                  display: 'inline-block'
                }}
              >
                🇨🇾
              </span>
            </div>
            <Badge
              variant="outline"
              className={`border-orange-500/70 text-orange-400 px-5 py-2 text-sm font-semibold rounded-full shadow-md ${
                theme === 'light' 
                  ? 'bg-orange-50/80 shadow-orange-200/60' 
                  : 'bg-orange-950/60 shadow-orange-900/60'
              }`}
            >
              Cyprus Web Agency ✨
            </Badge>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight !leading-tight"
          >
            <div className={`mb-2 md:mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`}>
              We Craft
            </div>
            <WordRotate
              words={[
                <AuroraText key="word1" className="text-orange-500 block" colors={["#FDE047", "#FDBA74", "#F97316", "#EA580C"]} speed={1.5}>Beautiful Websites</AuroraText>,
                <AuroraText key="word2" className="text-orange-500 block" colors={["#FDE047", "#FDBA74", "#F97316", "#EA580C"]} speed={1.5}>Digital Experiences</AuroraText>,
                <AuroraText key="word3" className="text-orange-500 block" colors={["#FDE047", "#FDBA74", "#F97316", "#EA580C"]} speed={1.5}>E-commerce Stores</AuroraText>,
                <AuroraText key="word4" className="text-orange-500 block" colors={["#FDE047", "#FDBA74", "#F97316", "#EA580C"]} speed={1.5}>Landing Pages</AuroraText>,
                <AuroraText key="word5" className="text-orange-500 block" colors={["#FDE047", "#FDBA74", "#F97316", "#EA580C"]} speed={1.5}>Web Applications</AuroraText>,
              ]}
              duration={2500}
              motionProps={{
                initial: { opacity: 0, y: 30, scale: 0.9 },
                animate: { opacity: 1, y: 0, scale: 1 },
                exit: { opacity: 0, y: -30, scale: 0.9 },
                transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              }}
            />
            <div className={`mt-2 md:mt-4 flex items-baseline justify-center ${theme === 'light' ? 'text-slate-900' : 'text-slate-50'}`}>
              <span>That&nbsp;</span>
              <SparklesText 
                as={<span />}
                className={`text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
                colors={{ first: "#FDBA74", second: "#F97316" }}
                sparklesCount={1}
              >
                Convert
              </SparklesText>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <p className={`max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-300/90'
            }`}>
              Transform your ideas into <span className="font-semibold text-orange-500">high-converting websites</span> that drive real results.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>Design to Deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>SEO Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>AI-Powered Features</span>
              </div>
            </div>
          </motion.div>
          
          {/* Theme Toggle - Centered with context */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-3 pt-2"
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                <Sun className="w-3 h-3" />
                <span className="text-xs font-medium">Light</span>
              </div>
              <div className={`w-px h-3 ${theme === 'light' ? 'bg-slate-300' : 'bg-slate-600'}`} />
              <div className={`flex items-center gap-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                <Moon className="w-3 h-3" />
                <span className="text-xs font-medium">Dark</span>
              </div>
            </div>
            
            <motion.button
              onClick={() => {
                toggleTheme();
              }}
              className={`group relative flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                theme === 'light' 
                  ? 'bg-orange-50/80 border-orange-300/60 text-slate-700 hover:border-orange-400/80 hover:bg-orange-100/80' 
                  : 'bg-orange-950/60 border-orange-600/60 text-slate-300 hover:border-orange-500/80 hover:bg-orange-900/60'
              } shadow-md hover:shadow-lg backdrop-blur-sm`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                {theme === 'light' ? (
                  <>
                    <div className="relative">
                      <Sun className="w-4 h-4 text-orange-500" />
                      <div className="absolute inset-0 animate-pulse">
                        <Sun className="w-4 h-4 text-orange-300" />
                      </div>
                    </div>
                    <span>Switch to Dark</span>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Moon className="w-4 h-4 text-blue-400" />
                      <div className="absolute inset-0 animate-pulse">
                        <Moon className="w-4 h-4 text-blue-300" />
                      </div>
                    </div>
                    <span>Switch to Light</span>
                  </>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                theme === 'light' ? 'bg-orange-400' : 'bg-blue-400'
              } group-hover:scale-125`} />
            </motion.button>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-4 pt-8"
          >
            <Link href="/start-project">
              <Button
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-5 px-10 text-base shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:-translate-y-0.5 border-0 rounded-xl"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                <span className="flex items-center relative z-10 gap-2">
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Get Your Website Built
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className={`group relative font-semibold py-5 px-10 text-base shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:-translate-y-0.5 rounded-xl border-2 ${
                  theme === 'light'
                    ? 'text-slate-700 border-slate-300 hover:border-orange-500 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 shadow-slate-200/40 hover:shadow-orange-500/30'
                    : 'text-slate-300 border-slate-600 hover:border-orange-500 hover:bg-gradient-to-r hover:from-orange-950/30 hover:to-orange-900/30 hover:text-orange-400 shadow-black/20 hover:shadow-orange-500/30'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
                  View Our Work
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Client Access Section */}
          <motion.div
            variants={itemVariants}
            className="pt-8 flex flex-col items-center gap-3"
          >
            <Separator className={`w-16 ${
              theme === 'light' ? 'bg-slate-300/50' : 'bg-slate-600/50'
            }`} />
            <div className="flex flex-col items-center gap-3">
              <p className={`text-sm font-medium ${
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Already a client?
              </p>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`group relative font-medium px-6 py-2 text-sm transition-all duration-300 ease-in-out transform hover:scale-105 rounded-lg ${
                    theme === 'light'
                      ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50/80 border border-transparent hover:border-orange-200'
                      : 'text-orange-400 hover:text-orange-300 hover:bg-orange-950/40 border border-transparent hover:border-orange-600/30'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🚀</span>
                    Access Dashboard
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="pt-8 md:pt-12"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className={`flex flex-col items-center gap-2 ${
              theme === 'light' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <span className="text-xs font-medium uppercase tracking-wider">Explore More</span>
              <ChevronDown className="w-5 h-5" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Our Process Section - Centered Below */}
      <motion.div 
        ref={processRef}
        className="container mx-auto z-10 mt-16 md:mt-20 lg:mt-24 max-w-4xl"
        variants={leftColumnVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-8 md:mb-12">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
            Our <span className="text-orange-500">Process</span>
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            From concept to launch in 3 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={processStepVariants}
              className="relative"
              animate={{
                scale: activeProcessStep === index ? 1.05 : 1,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className={`relative flex flex-col items-center text-center p-6 md:p-8 rounded-xl border backdrop-blur-md transition-all duration-500 overflow-hidden h-[280px] md:h-[320px] ${
                activeProcessStep === index 
                  ? `border-orange-500/50 shadow-lg shadow-orange-500/20 ${
                      theme === 'light' 
                        ? 'bg-orange-50/80' 
                        : 'bg-neutral-800/50'
                    }` 
                  : `hover:scale-[1.02] ${
                      theme === 'light'
                        ? 'border-slate-300/50 bg-white/80'
                        : 'border-neutral-700/50 bg-neutral-800/30'
                    }`
              }`}>
                {activeProcessStep === index && (
                  <BorderBeam
                    size={100}
                    duration={4}
                    colorFrom="#F97316"
                    colorTo="#F97316"
                  />
                )}
                <div className="flex-shrink-0 relative z-10 mb-4">
                  <motion.div 
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl border flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                      activeProcessStep === index
                        ? 'bg-orange-500/20 border-orange-500/50'
                        : theme === 'light'
                          ? 'bg-slate-100/80 border-slate-300/50'
                          : 'bg-neutral-700/50 border-neutral-600/50'
                    }`}
                    animate={{
                      scale: activeProcessStep === index ? 1.1 : 1,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <step.icon className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-300 ${
                      activeProcessStep === index 
                        ? 'text-orange-500' 
                        : theme === 'light'
                          ? 'text-slate-600'
                          : 'text-slate-400'
                    }`} />
                  </motion.div>
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    activeProcessStep === index
                      ? 'bg-orange-500 text-white'
                      : theme === 'light'
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-neutral-700 text-slate-400'
                  }`}>
                    {step.step}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center relative z-10">
                  <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 ${
                    activeProcessStep === index 
                      ? 'text-orange-500' 
                      : theme === 'light'
                        ? 'text-slate-900'
                        : 'text-slate-100'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Benefits Section - Full Width Below with Scroll Effects */}
      <motion.div 
        className="container mx-auto z-10 mt-16 md:mt-24 lg:mt-32 px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          variants={itemVariants} 
          className="text-3xl sm:text-4xl font-bold text-center mb-10 md:mb-12 flex items-center justify-center"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-8 h-8 mr-3 text-orange-500" />
          </motion.div>
          <span className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>
            Our <span className="text-orange-500">Creation Methods</span>
          </span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
