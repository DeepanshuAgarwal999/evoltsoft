<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <AuthHeader title="Welcome back" subtitle="Sign in to your account" iconType="login" bgGradient="from-indigo-500 to-purple-600" />

      <div class="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="emailOrPhone" class="block text-sm font-medium text-gray-700 mb-2"> Email or Phone Number </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg v-if="isEmail" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  ></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
              </div>
              <input
                id="emailOrPhone"
                v-model="formData.emailOrPhone"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                :placeholder="isEmail ? 'Enter your email' : 'Enter your phone number'"
                @input="detectInputType"
              />
            </div>
            <p v-if="emailPhoneError" class="mt-1 text-sm text-red-600">{{ emailPhoneError }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2"> Password </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="Enter your password"
              />
              <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center" @click="togglePasswordVisibility">
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.465 8.465M9.878 9.878a3 3 0 00-.007.013m6.364 6.364l1.414 1.414M9.878 9.878l-1.414-1.414m8.485 8.485L21 21M3 3l2.293 2.293m0 0l8.485 8.485"
                  ></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>
          <!-- Submit Button -->
          <div>
            <Button class="w-full" @click="handleSubmit" :isLoading="isLoading">Sign in</Button>
          </div>

          <!-- Error Message -->
          <div v-if="generalError" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ generalError }}</p>
              </div>
            </div>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <a href="#" @click="$emit('switch-to-signup')" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Button from "../../components/shared/Button.vue";
import AuthHeader from "../../components/shared/AuthHeader.vue";
import UserService from "../../services/user-service";
import { toast } from "vue-sonner";

const router = useRouter();
// Form data interface
interface FormData {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
}

// Reactive form data
const formData = ref<FormData>({
  emailOrPhone: "",
  password: "",
  rememberMe: false,
});

// UI state
const showPassword = ref(false);
const isLoading = ref(false);

// Error states
const emailPhoneError = ref("");
const passwordError = ref("");
const generalError = ref("");

// Define emits
defineEmits(["switch-to-signup"]);

// Computed property to detect if input is email or phone
const isEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formData.value.emailOrPhone);
});

// Methods
const detectInputType = () => {
  emailPhoneError.value = "";
  generalError.value = "";
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const validateEmailOrPhone = (): boolean => {
  const value = formData.value.emailOrPhone.trim();

  if (!value) {
    emailPhoneError.value = "Email or phone number is required";
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone validation (basic international format)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

  if (!emailRegex.test(value) && !phoneRegex.test(value)) {
    emailPhoneError.value = "Please enter a valid email address or phone number";
    return false;
  }

  emailPhoneError.value = "";
  return true;
};

const validatePassword = (): boolean => {
  const password = formData.value.password;

  if (!password) {
    passwordError.value = "Password is required";
    return false;
  }

  if (password.length < 6) {
    passwordError.value = "Password must be at least 6 characters long";
    return false;
  }

  passwordError.value = "";
  return true;
};

const handleSubmit = async () => {
  // Clear previous errors
  emailPhoneError.value = "";
  passwordError.value = "";
  generalError.value = "";

  // Validate form
  const isEmailPhoneValid = validateEmailOrPhone();
  const isPasswordValid = validatePassword();

  if (!isEmailPhoneValid || !isPasswordValid) {
    return;
  }

  // Start loading
  isLoading.value = true;

  try {
    // Prepare credentials
    const credentials: any = {
      password: formData.value.password,
    };
    if (formData.value.emailOrPhone.includes("@")) {
      credentials.email = formData.value.emailOrPhone;
    } else {
      credentials.phone = formData.value.emailOrPhone;
    }

    // Login user - token will be automatically stored by UserService
    const response = await UserService.loginUser(credentials);
    console.log(response);

    // Redirect to home page after successful login
    toast.success("Login successful!");
    router.push("/");
  } catch (error) {
    toast.error("Login failed. Please check your credentials and try again.");
    generalError.value = "Login failed. Please check your credentials and try again.";
    console.error("Login error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
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
