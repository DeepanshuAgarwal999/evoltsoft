<template>
  <button :type="type" :disabled="disabled || isLoading" :class="buttonClasses" @click="handleClick">
    <span v-if="!isLoading">
      <slot>{{ text }}</slot>
    </span>
    <span v-else class="flex items-center">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {{ loadingText }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Define props interface
interface Props {
  text?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "custom";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  bgColor?: string;
  bgColorHover?: string;
  focusColor?: string;
  customClasses?: string;
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  text: "Button",
  type: "button",
  disabled: false,
  isLoading: false,
  loadingText: "Loading...",
  variant: "primary",
  size: "md",
  fullWidth: false,
  bgColor: "",
  bgColorHover: "",
  focusColor: "",
  customClasses: "",
});

// Define emits
const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Handle click event
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.isLoading) {
    emit("click", event);
  }
};

// Computed classes for different variants
const variantClasses = computed(() => {
  if (props.variant === "custom" && props.bgColor) {
    return {
      bg: props.bgColor,
      bgHover: props.bgColorHover || props.bgColor,
      focus: props.focusColor || "ring-gray-500",
      text: "text-white",
    };
  }

  const variants = {
    primary: {
      bg: "bg-gradient-to-r from-indigo-500 to-purple-600",
      bgHover: "hover:from-indigo-600 hover:to-purple-700",
      focus: "focus:ring-indigo-500",
      text: "text-white",
    },
    secondary: {
      bg: "bg-gradient-to-r from-gray-500 to-gray-600",
      bgHover: "hover:from-gray-600 hover:to-gray-700",
      focus: "focus:ring-gray-500",
      text: "text-white",
    },
    success: {
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      bgHover: "hover:from-green-600 hover:to-green-700",
      focus: "focus:ring-green-500",
      text: "text-white",
    },
    danger: {
      bg: "bg-gradient-to-r from-red-500 to-red-600",
      bgHover: "hover:from-red-600 hover:to-red-700",
      focus: "focus:ring-red-500",
      text: "text-white",
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
      bgHover: "hover:from-yellow-600 hover:to-orange-600",
      focus: "focus:ring-yellow-500",
      text: "text-white",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
      bgHover: "hover:from-blue-600 hover:to-cyan-600",
      focus: "focus:ring-blue-500",
      text: "text-white",
    },
  };

  return variants[props.variant as keyof typeof variants];
});

// Computed classes for different sizes
const sizeClasses = computed(() => {
  const sizes = {
    sm: "py-2 px-3 text-xs",
    md: "py-3 px-4 text-sm",
    lg: "py-3 px-6 text-base",
    xl: "py-4 px-8 text-lg",
  };

  return sizes[props.size];
});

// Computed button classes
const buttonClasses = computed(() => {
  const baseClasses = [
    "group relative flex justify-center items-center",
    "border border-transparent font-medium rounded-lg",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-200 shadow-lg hover:shadow-xl",
    "transform hover:-translate-y-0.5",
  ];

  const widthClass = props.fullWidth ? "w-full" : "w-auto";
  const variant = variantClasses.value;
  const size = sizeClasses.value;

  return [...baseClasses, widthClass, size, variant.bg, variant.bgHover, variant.focus, variant.text, props.customClasses].filter(Boolean).join(" ");
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
