<template>
  <div class="text-center">
    <div :class="iconContainerClasses">
      <component :is="iconComponent" />
    </div>
    <h2 class="mt-6 text-3xl font-extrabold text-gray-900">{{ title }}</h2>
    <p class="mt-2 text-sm text-gray-600">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";

// Define props interface
interface Props {
  title?: string;
  subtitle?: string;
  iconType?: "login" | "signup";
  bgGradient?: string;
  iconSize?: "sm" | "md" | "lg" | "xl";
  customIcon?: string;
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  title: "Welcome",
  subtitle: "Please authenticate to continue",
  iconType: "login",
  bgGradient: "from-indigo-500 to-purple-600",
  iconSize: "md",
  customIcon: "",
});

// Icon size classes
const iconSizeClasses = computed(() => {
  const sizes = {
    sm: { container: "h-12 w-12", icon: "h-6 w-6" },
    md: { container: "h-16 w-16", icon: "h-8 w-8" },
    lg: { container: "h-20 w-20", icon: "h-10 w-10" },
    xl: { container: "h-24 w-24", icon: "h-12 w-12" },
  };
  return sizes[props.iconSize];
});

// Icon container classes
const iconContainerClasses = computed(() => {
  const baseClasses = "mx-auto rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r";
  const sizeClass = iconSizeClasses.value.container;
  const gradientClass = props.bgGradient;

  return `${baseClasses} ${sizeClass} ${gradientClass}`;
});

// Icon components based on type
const iconComponents = {
  login: () =>
    h(
      "svg",
      {
        class: `${iconSizeClasses.value.icon} text-white`,
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        }),
      ]
    ),

  signup: () =>
    h(
      "svg",
      {
        class: `${iconSizeClasses.value.icon} text-white`,
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
        }),
      ]
    ),
};

// Computed icon component
const iconComponent = computed(() => {
  return iconComponents[props.iconType] || iconComponents.login;
});
</script>

