"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, Variants, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Send, 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  Zap,
  Brain,
  User,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import ReactMarkdown from 'react-markdown';
import { useTheme } from "@/lib/theme-context";

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const robotVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5, 
    rotate: -180 
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "backOut",
      delay: 0.5
    },
  },
};

const chatCardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.8
    },
  },
};

const messageVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20, 
    scale: 0.8 
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.8,
    transition: {
      duration: 0.3
    }
  }
};

const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Custom markdown components for better styling
const MarkdownComponents = (theme: 'light' | 'dark') => ({
  p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }: any) => <strong className="font-semibold text-orange-500">{children}</strong>,
  em: ({ children }: any) => <em className={`italic ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>{children}</em>,
  ul: ({ children }: any) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
  li: ({ children }: any) => <li className={theme === 'light' ? 'text-slate-900' : 'text-slate-100'}>{children}</li>,
  h1: ({ children }: any) => <h1 className="text-lg font-bold text-orange-500 mb-2">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-base font-bold text-orange-500 mb-2">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-sm font-bold text-orange-500 mb-1">{children}</h3>,
  code: ({ children }: any) => (
    <code className={`px-1 py-0.5 rounded text-xs font-mono ${
      theme === 'light' 
        ? 'bg-slate-200 text-orange-600' 
        : 'bg-neutral-800 text-orange-300'
    }`}>
      {children}
    </code>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className={`border-l-2 border-orange-500 pl-3 italic ${
      theme === 'light' ? 'text-slate-700' : 'text-slate-200'
    }`}>
      {children}
    </blockquote>
  ),
});

export default function ChatSection() {
  const sectionRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { theme } = useTheme();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm ZeroBot, your AI assistant. I know everything about Zero Point Labs - our services, expertise, and how we can help transform your digital presence. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "What services do you offer?",
    "How much does a website cost?",
    "What's your development process?",
    "Can you help with AI integration?"
  ];

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is updated before scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage.trim();
    if (!messageText || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    // Simulate bot response with placeholder text
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! Our AI assistant is currently being updated. Please contact us directly at info@zeropointlabs.com or use the contact form for immediate assistance with your project needs.",
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setIsTyping(false);
      // Force scroll after bot message is added
      setTimeout(scrollToBottom, 50);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full py-20 md:py-32 px-4 md:px-8 overflow-hidden ${
        theme === 'light'
          ? 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900'
          : 'bg-[#0A0A0A] text-slate-100'
      }`}
    >
      {/* Background Pattern - matching your other sections */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,${
        theme === 'light' ? '#e2e8f0' : '#1f2937'
      }_1px,transparent_1px),linear-gradient(to_bottom,${
        theme === 'light' ? '#e2e8f0' : '#1f2937'
      }_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-10`} />
      
      {/* Floating Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className={`absolute top-20 left-10 w-6 h-6 rounded-full blur-sm ${
          theme === 'light' ? 'bg-orange-300/40' : 'bg-orange-500/20'
        }`}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "-2s" }}
        className={`absolute top-40 right-20 w-4 h-4 rounded-full blur-sm ${
          theme === 'light' ? 'bg-orange-300/30' : 'bg-orange-500/15'
        }`}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "-4s" }}
        className={`absolute bottom-32 left-1/4 w-8 h-8 rounded-full blur-sm ${
          theme === 'light' ? 'bg-orange-300/20' : 'bg-orange-500/10'
        }`}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-20">
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-4 md:mb-6">
              <div className={`w-8 h-8 md:w-10 md:h-10 border rounded-xl flex items-center justify-center ${
                theme === 'light'
                  ? 'bg-orange-100/60 border-orange-200/60'
                  : 'bg-orange-500/15 border-orange-500/30'
              }`}>
                <Bot className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
              </div>
              <Badge className={`border-orange-500/50 text-orange-400 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium ${
                theme === 'light' ? 'bg-orange-50/80' : 'bg-orange-950/50'
              }`}>
                AI Assistant
              </Badge>
            </motion.div>
            
            <h2 className={`text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 ${
              theme === 'light' ? 'text-slate-900' : 'text-slate-50'
            }`}>
              Ask Our AI <span className="text-orange-500">Anything</span>
            </h2>
            
            <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-300/90'
            }`}>
              Meet ZeroBot, our intelligent assistant that knows everything about Zero Point Labs. 
              Get instant answers about our services, pricing, process, and how we can bring your digital vision to life.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Robot & Features */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Animated Robot */}
              <motion.div 
                variants={robotVariants}
                className="relative flex justify-center mb-8"
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-xl opacity-30 scale-150" />
                  
                  {/* Robot Container */}
                  <div className={`relative p-8 rounded-3xl backdrop-blur-md border ${
                    theme === 'light'
                      ? 'bg-white/60 border-slate-200/50'
                      : 'bg-neutral-800/50 border-neutral-700/50'
                  }`}>
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1] 
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                      className="text-6xl"
                    >
                      <Bot className="w-16 h-16 text-orange-400" />
                    </motion.div>
                    
                    {/* Pulsing rings */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-orange-500/30 rounded-3xl"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute inset-0 border border-orange-500/20 rounded-3xl"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Brain, text: "Powered by advanced AI technology" },
                  { icon: Zap, text: "Instant responses 24/7" },
                  { icon: CheckCircle, text: "Expert knowledge about our services" },
                  { icon: Sparkles, text: "Personalized recommendations" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                      theme === 'light'
                        ? 'bg-white/40 border-slate-200/30 hover:bg-white/60'
                        : 'bg-neutral-800/30 border-neutral-700/30 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg border ${
                      theme === 'light'
                        ? 'bg-orange-100/60 border-orange-200/60'
                        : 'bg-orange-500/15 border-orange-500/30'
                    }`}>
                      <feature.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Chat Interface */}
            <motion.div variants={chatCardVariants} className="relative">
              <Card className={`backdrop-blur-md rounded-2xl overflow-hidden border ${
                theme === 'light'
                  ? 'bg-white/80 border-slate-200/60 shadow-lg shadow-slate-200/20'
                  : 'bg-neutral-900/50 border-neutral-700/50'
              }`}>
                <BorderBeam
                  size={250}
                  duration={8}
                  delay={2}
                  colorFrom="#F97316"
                  colorTo="#F97316"
                />
                
                {/* Chat Header */}
                <CardHeader className={`border-b ${
                  theme === 'light'
                    ? 'border-slate-200/50 bg-slate-50/80'
                    : 'border-neutral-700/50 bg-neutral-800/30'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Bot className="w-8 h-8 text-orange-400" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>ZeroBot</h3>
                      <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        {isTyping ? "Typing..." : "Online"}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Chat Messages */}
                <CardContent className="p-0">
                  <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.isBot 
                              ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                              : theme === 'light'
                                ? 'bg-gradient-to-br from-slate-400 to-slate-500'
                                : 'bg-gradient-to-br from-neutral-600 to-neutral-700'
                          }`}>
                            {message.isBot ? (
                              <Bot className="w-4 h-4 text-white" />
                            ) : (
                              <User className="w-4 h-4 text-white" />
                            )}
                          </div>
                          
                          <div className={`max-w-[80%] ${message.isBot ? '' : 'text-right'}`}>
                            <div className={`inline-block px-4 py-3 rounded-2xl ${
                              message.isBot
                                ? theme === 'light'
                                  ? 'bg-slate-100 text-slate-900'
                                  : 'bg-neutral-700/60 text-slate-100'
                                : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                            }`}>
                              {message.isBot ? (
                                <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                                  theme === 'light' ? 'prose-slate' : 'prose-invert'
                                }`}>
                                  <ReactMarkdown components={MarkdownComponents(theme)}>
                                    {message.text}
                                  </ReactMarkdown>
                                </div>
                              ) : (
                                <p className="text-sm leading-relaxed">{message.text}</p>
                              )}
                            </div>
                            <p className={`text-xs mt-1 px-2 ${
                              theme === 'light' ? 'text-slate-500' : 'text-slate-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className={`px-4 py-2 rounded-2xl ${
                          theme === 'light' ? 'bg-slate-100' : 'bg-neutral-700/60'
                        }`}>
                          <div className="flex gap-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                              className={`w-2 h-2 rounded-full ${
                                theme === 'light' ? 'bg-slate-500' : 'bg-slate-400'
                              }`}
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                              className={`w-2 h-2 rounded-full ${
                                theme === 'light' ? 'bg-slate-500' : 'bg-slate-400'
                              }`}
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                              className={`w-2 h-2 rounded-full ${
                                theme === 'light' ? 'bg-slate-500' : 'bg-slate-400'
                              }`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Auto-scroll target */}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggested Questions */}
                  <div className={`p-4 border-t ${
                    theme === 'light'
                      ? 'border-slate-200/50 bg-slate-50/60'
                      : 'border-neutral-700/50 bg-neutral-800/20'
                  }`}>
                    <p className={`text-sm mb-3 ${
                      theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                    }`}>Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className={`text-xs transition-all duration-200 ${
                            theme === 'light'
                              ? 'border-slate-300 text-slate-600 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50'
                              : 'border-neutral-600 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/10'
                          }`}
                          onClick={() => handleSendMessage(question)}
                          disabled={isLoading}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Input */}
                  <div className={`p-4 border-t ${
                    theme === 'light' ? 'border-slate-200/50' : 'border-neutral-700/50'
                  }`}>
                    <div className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about Zero Point Labs..."
                        className={`flex-1 focus:border-orange-500 ${
                          theme === 'light'
                            ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500'
                            : 'bg-neutral-800/50 border-neutral-600 text-white placeholder:text-slate-400'
                        }`}
                        disabled={isLoading}
                      />
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white border-0"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-16"
          >
            <Card className={`backdrop-blur-sm relative overflow-hidden ${
              theme === 'light'
                ? 'bg-gradient-to-b from-orange-50/80 via-white/90 to-white/90 border-orange-200/60'
                : 'bg-gradient-to-b from-orange-500/5 via-neutral-900/90 to-neutral-900/90 border-orange-500/40'
            }`}>
              <CardContent className="p-8">
                <div className="relative z-10">
                  <MessageCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h3 className={`text-2xl font-bold mb-4 ${
                    theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    Ready to Start Your Project?
                  </h3>
                  <p className={`mb-6 max-w-2xl mx-auto ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-300/90'
                  }`}>
                    If you need more detailed information or want to discuss your specific requirements, 
                    our team is ready to help you bring your vision to life.
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white border-0 px-8 py-3 shadow-lg shadow-orange-500/25">
                    Get Started Today
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <BorderBeam
                  size={250}
                  duration={10}
                  delay={4}
                  colorFrom="#F97316"
                  colorTo="#F97316"
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
