<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <div class="form-header">
      <h2 class="form-title">Create Account</h2>
      <p class="form-subtitle">Join us today</p>
    </div>

    <div v-if="error" class="error-message">
      <font-awesome-icon icon="fa-solid fa-exclamation-circle" />
      {{ error.message }}
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="firstName" class="form-label">First Name</label>
        <div class="input-group">
          <font-awesome-icon icon="fa-solid fa-user" class="input-icon" />
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            class="form-input"
            :class="{ 'error': errors.first_name }"
            placeholder="First name"
            required
            autocomplete="given-name"
          />
        </div>
        <span v-if="errors.first_name" class="field-error">{{ errors.first_name[0] }}</span>
      </div>

      <div class="form-group">
        <label for="lastName" class="form-label">Last Name</label>
        <div class="input-group">
          <font-awesome-icon icon="fa-solid fa-user" class="input-icon" />
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            class="form-input"
            :class="{ 'error': errors.last_name }"
            placeholder="Last name"
            required
            autocomplete="family-name"
          />
        </div>
        <span v-if="errors.last_name" class="field-error">{{ errors.last_name[0] }}</span>
      </div>
    </div>

    <div class="form-group">
      <label for="middleName" class="form-label">Middle Name (Optional)</label>
      <div class="input-group">
        <font-awesome-icon icon="fa-solid fa-user" class="input-icon" />
        <input
          id="middleName"
          v-model="form.middleName"
          type="text"
          class="form-input"
          :class="{ 'error': errors.middle_name }"
          placeholder="Middle name"
          autocomplete="additional-name"
        />
      </div>
      <span v-if="errors.middle_name" class="field-error">{{ errors.middle_name[0] }}</span>
    </div>

    <div class="form-group">
      <label for="email" class="form-label">Email Address</label>
      <div class="input-group">
        <font-awesome-icon icon="fa-solid fa-envelope" class="input-icon" />
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-input"
          :class="{ 'error': errors.email }"
          placeholder="Enter your email"
          required
          autocomplete="email"
        />
      </div>
      <span v-if="errors.email" class="field-error">{{ errors.email[0] }}</span>
    </div>

    <div class="form-group">
      <label for="mobileNumber" class="form-label">Mobile Number</label>
      <div class="input-group">
        <font-awesome-icon icon="fa-solid fa-phone" class="input-icon" />
        <input
          id="mobileNumber"
          v-model="form.mobileNumber"
          type="tel"
          class="form-input"
          :class="{ 'error': errors.mobile_number }"
          placeholder="Enter your mobile number"
          required
          autocomplete="tel"
        />
      </div>
      <span v-if="errors.mobile_number" class="field-error">{{ errors.mobile_number[0] }}</span>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <div class="input-group">
          <font-awesome-icon icon="fa-solid fa-lock" class="input-icon" />
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            :class="{ 'error': errors.password }"
            placeholder="Create password"
            required
            autocomplete="new-password"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="password-toggle"
          >
            <font-awesome-icon :icon="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" />
          </button>
        </div>
        <span v-if="errors.password" class="field-error">{{ errors.password[0] }}</span>
      </div>

      <div class="form-group">
        <label for="passwordConfirmation" class="form-label">Confirm Password</label>
        <div class="input-group">
          <font-awesome-icon icon="fa-solid fa-lock" class="input-icon" />
          <input
            id="passwordConfirmation"
            v-model="form.passwordConfirmation"
            :type="showPasswordConfirm ? 'text' : 'password'"
            class="form-input"
            :class="{ 'error': errors.password_confirmation }"
            placeholder="Confirm password"
            required
            autocomplete="new-password"
          />
          <button
            type="button"
            @click="showPasswordConfirm = !showPasswordConfirm"
            class="password-toggle"
          >
            <font-awesome-icon :icon="showPasswordConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" />
          </button>
        </div>
        <span v-if="errors.password_confirmation" class="field-error">{{ errors.password_confirmation[0] }}</span>
      </div>
    </div>

    <div class="form-group">
      <label class="checkbox-label">
        <input
          v-model="form.agreeToTerms"
          type="checkbox"
          class="checkbox-input"
          required
        />
        <span class="checkbox-custom"></span>
        I agree to the 
        <a href="/terms" target="_blank" class="terms-link">Terms of Service</a>
        and 
        <a href="/privacy" target="_blank" class="terms-link">Privacy Policy</a>
      </label>
    </div>

    <button
      type="submit"
      class="submit-button"
      :disabled="isLoading || !form.agreeToTerms"
    >
      <font-awesome-icon
        v-if="isLoading"
        icon="fa-solid fa-spinner"
        spin
        class="button-icon"
      />
      <font-awesome-icon
        v-else
        icon="fa-solid fa-user-plus"
        class="button-icon"
      />
      {{ isLoading ? 'Creating Account...' : 'Create Account' }}
    </button>

    <div class="form-footer">
      <div class="signin-prompt">
        Already have an account?
        <router-link to="/login" class="signin-link">
          Sign in here
        </router-link>
      </div>
    </div>
  </form>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth.js'

export default {
  name: 'RegisterForm',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['success', 'error'],
  setup(props, { emit }) {
    const { register, isLoading, error, clearError } = useAuth(props.config)

    const form = ref({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      password: '',
      passwordConfirmation: '',
      agreeToTerms: false
    })

    const showPassword = ref(false)
    const showPasswordConfirm = ref(false)

    const errors = computed(() => {
      return error.value?.errors || {}
    })

    const handleSubmit = async () => {
      clearError()

      try {
        await register({
          firstName: form.value.firstName,
          middleName: form.value.middleName,
          lastName: form.value.lastName,
          email: form.value.email,
          mobileNumber: form.value.mobileNumber,
          password: form.value.password,
          passwordConfirmation: form.value.passwordConfirmation
        })
        
        emit('success')
      } catch (err) {
        emit('error', err)
      }
    }

    return {
      form,
      showPassword,
      showPasswordConfirm,
      errors,
      isLoading,
      error,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.register-form {
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.form-subtitle {
  color: #6b7280;
  margin: 0;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #dc2626;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  z-index: 1;
}

.password-toggle:hover {
  color: #6b7280;
}

.field-error {
  display: block;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  position: relative;
  transition: all 0.15s ease;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.checkbox-input:checked + .checkbox-custom {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.terms-link {
  color: #3b82f6;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.submit-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background: #2563eb;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-icon {
  font-size: 0.875rem;
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.signin-prompt {
  font-size: 0.875rem;
  color: #6b7280;
}

.signin-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.signin-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .register-form {
    padding: 1.5rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style> 