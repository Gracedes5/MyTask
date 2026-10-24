export const trim = (v: string) => v.trim();

export const required = (v: string) => trim(v).length > 0;

export const minLen = (v: string, n: number) => trim(v).length >= n;

export const maxLen = (v: string, n: number) => trim(v).length <= n;

export const isEmail = (v: string) => {
  const value = trim(v);
  if (value.length === 0) return false;
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isUsername = (v: string) => {
  const value = trim(v);
  if (value.length === 0) return false;
  // Allow alphanumeric and underscore, 3-20 chars
  return /^[a-zA-Z0-9_]{3,20}$/.test(value);
};

export const isPassword = (v: string) => {
  // At least 6 chars, at least one letter and one number
  if (typeof v !== "string") return false;
  if (v.length < 6) return false;
  const hasLetter = /[A-Za-z]/.test(v);
  const hasNumber = /\d/.test(v);
  return hasLetter && hasNumber;
};

export type FieldErrors = Record<string, string | undefined>;

export function validateCreateAccount(values: {
  name: string;
  username: string;
  email: string;
  password: string;
}): { ok: boolean; errors: FieldErrors; trimmed: typeof values } {
  const errors: FieldErrors = {};
  const trimmed = {
    name: trim(values.name),
    username: trim(values.username),
    email: trim(values.email),
    password: values.password, // don't trim password
  };

  if (!required(trimmed.name)) {
    errors.name = "Please enter your full name.";
  } else if (trimmed.name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (trimmed.name.length > 50) {
    errors.name = "Name must be under 50 characters.";
  } else if (/\d/.test(trimmed.name)) {
    errors.name = "Full name cannot contain numbers or phone numbers.";
  } else if (/[^A-Za-z\s'.-]/.test(trimmed.name)) {
    errors.name = "Full name can only contain letters, spaces, apostrophes, dots or hyphens.";
  } else {
    const parts = trimmed.name.replace(/\s+/g, " ").split(" ").filter(Boolean);
    if (parts.length < 2) {
      errors.name = "Please enter both your first and last name.";
    }
  }

  if (!required(trimmed.username)) {
    errors.username = "Please enter a username.";
  } else if (!isUsername(trimmed.username)) {
    errors.username = "Username must be 3-20 chars (letters, numbers, underscores).";
  }

  if (!required(trimmed.email)) {
    errors.email = "Please enter your email.";
  } else if (!isEmail(trimmed.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (trimmed.password.length === 0) {
    errors.password = "Please enter a password.";
  } else if (!isPassword(trimmed.password)) {
    errors.password = "Password must be at least 6 chars with letters and numbers.";
  }

  return { ok: Object.keys(errors).length === 0, errors, trimmed };
}

export function validateLogin(values: {
  username: string;
  password: string;
}): { ok: boolean; errors: FieldErrors; trimmed: { username: string; password: string } } {
  const errors: FieldErrors = {};
  const trimmed = {
    username: trim(values.username),
    password: values.password,
  };

  if (!required(trimmed.username)) {
    errors.username = "Please enter your username.";
  } else if (!isUsername(trimmed.username)) {
    errors.username = "Enter a valid username (3-20 chars).";
  }

  if (trimmed.password.length === 0) {
    errors.password = "Please enter your password.";
  }

  return { ok: Object.keys(errors).length === 0, errors, trimmed };
}

export function validateAddTask(values: {
  title: string;
  description: string;
}): { ok: boolean; errors: FieldErrors; trimmed: { title: string; description: string } } {
  const errors: FieldErrors = {};
  const trimmed = {
    title: trim(values.title),
    description: trim(values.description),
  };

  if (!required(trimmed.title)) {
    errors.title = "Title is required.";
  } else if (trimmed.title.length > 100) {
    errors.title = "Title must be under 100 characters.";
  }

  if (trimmed.description.length > 300) {
    errors.description = "Description must be under 300 characters.";
  }

  return { ok: Object.keys(errors).length === 0, errors, trimmed };
}
