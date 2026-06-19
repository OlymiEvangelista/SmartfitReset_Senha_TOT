import { CheckCheck } from "lucide-react";
import { RecoveryStep } from "../types";
import { motion } from "motion/react";

interface SidebarProps {
  steps: RecoveryStep[];
  currentStep: number;
  highestStepReached: number;
  onStepClick: (stepId: number) => void;
}

export default function Sidebar({
  steps,
  currentStep,
  highestStepReached,
  onStepClick,
}: SidebarProps) {
  return (
    <div className="w-full lg:w-80 bg-brand-dark/95 border-b lg:border-b-0 lg:border-r border-white/10 p-6 lg:p-8 flex flex-col justify-between shrink-0 relative overflow-hidden">
      {/* Decorative corporate accent glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-brand-yellow/5 rounded-full blur-3xl -translate-x-10 -translate-y-10" />

      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 lg:mb-12 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-brand-yellow flex items-center justify-center font-bold text-black shadow-lg shadow-brand-yellow/20">
            SF
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-lg text-white leading-tight">
              SmartFit
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-brand-yellow/80 font-mono font-medium">
              Cache & AD Manager
            </p>
          </div>
        </div>

        {/* Desktop Step Index List */}
        <div className="hidden lg:flex flex-col gap-8 relative">
          {/* Vertical Connecting Track Line Line */}
          <div className="absolute left-6 top-3 bottom-3 w-[2px] bg-white/5" />
          
          {/* Active fill line indicator */}
          <div 
            className="absolute left-6 top-3 w-[2px] bg-brand-yellow transition-all duration-500 ease-out"
            style={{ 
              height: `${((highestStepReached - 1) / (steps.length - 1)) * 100}%`,
              maxHeight: "90%"
            }} 
          />

          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const isAllowed = step.id <= highestStepReached;

            return (
              <button
                key={step.id}
                id={`sidebar-step-${step.id}`}
                onClick={() => isAllowed && onStepClick(step.id)}
                disabled={!isAllowed}
                className={`flex gap-4 text-left group transition-all relative z-10 ${
                  isAllowed ? "cursor-pointer" : "cursor-not-allowed opacity-40"
                }`}
              >
                {/* Step Circle Indicator */}
                <div className="relative shrink-0">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-12 h-12 rounded-full bg-brand-yellow text-black flex items-center justify-center shadow-md shadow-brand-yellow/20"
                    >
                      <CheckCheck className="w-5 h-5 stroke-[2.5]" />
                    </motion.div>
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-heading font-extrabold text-sm transition-all ${
                        isActive
                          ? "bg-[#28282e] border-brand-yellow text-brand-yellow shadow-lg shadow-brand-yellow/10"
                          : "bg-brand-slate border-white/10 text-gray-400 group-hover:border-white/30"
                      }`}
                    >
                      {step.id}
                    </div>
                  )}

                  {/* Active pulses */}
                  {isActive && (
                    <div className="absolute -inset-1 rounded-full border border-brand-yellow/30 animate-ping opacity-60 pointer-events-none" />
                  )}
                </div>

                {/* Step labels */}
                <div className="flex flex-col justify-center min-w-0">
                  <span
                    className={`font-heading text-sm font-semibold transition-colors duration-150 ${
                      isActive
                        ? "text-brand-yellow"
                        : isCompleted
                        ? "text-white/90"
                        : "text-gray-400 group-hover:text-gray-200"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5 truncate max-w-[180px]">
                    {step.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Horizontal Stepper Indicator */}
        <div className="lg:hidden flex items-center justify-between gap-2 p-2 bg-[#202024]/40 rounded-xl border border-white/5 relative mb-4">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const isAllowed = step.id <= highestStepReached;

            return (
              <button
                key={step.id}
                id={`sidebar-step-mobile-${step.id}`}
                disabled={!isAllowed}
                onClick={() => isAllowed && onStepClick(step.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-1 relative rounded-lg ${
                  isActive ? "bg-white/5" : ""
                } ${isAllowed ? "cursor-pointer" : "cursor-not-allowed opacity-30"}`}
              >
                <div
                  className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold ${
                    isCompleted
                      ? "bg-brand-yellow text-black"
                      : isActive
                      ? "bg-brand-slate border border-brand-yellow text-brand-yellow"
                      : "bg-[#28282e] text-gray-500"
                  }`}
                >
                  {isCompleted ? <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" /> : step.id}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-brand-yellow font-semibold" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info Info */}
      <div className="hidden lg:flex flex-col gap-1 text-[10px] font-mono text-gray-600 relative z-10 border-t border-white/5 pt-4">
        <span>SECURITY PORTAL v2.1</span>
        <span>ZENVIA SMS GATEWAY ACTIVE</span>
        <span>MOCK VERIFICATION ONLY</span>
      </div>
    </div>
  );
}
