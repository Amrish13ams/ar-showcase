// Backblaze B2 troubleshooting utilities

export interface LoginIssue {
  problem: string
  solutions: string[]
  priority: "high" | "medium" | "low"
}

export const commonLoginIssues: LoginIssue[] = [
  {
    problem: "Email not verified",
    solutions: [
      "Check your email inbox (including spam/junk folder)",
      "Click the verification link in the email",
      "Request a new verification email from login page",
      "Wait 5-10 minutes after verification before trying to login",
    ],
    priority: "high",
  },
  {
    problem: "Incorrect password",
    solutions: [
      "Use 'Forgot Password' link on login page",
      "Check if Caps Lock is on",
      "Try typing password in a text editor first to verify",
      "Clear browser cache and cookies",
    ],
    priority: "high",
  },
  {
    problem: "Account creation failed",
    solutions: [
      "Try a different email address",
      "Use a different browser (Chrome, Firefox, Safari)",
      "Disable browser extensions temporarily",
      "Try from a different network/location",
    ],
    priority: "medium",
  },
  {
    problem: "Browser/cache issues",
    solutions: [
      "Clear browser cache and cookies",
      "Try incognito/private browsing mode",
      "Disable ad blockers and extensions",
      "Try a different browser entirely",
    ],
    priority: "medium",
  },
]

export function diagnoseLoginIssue(symptoms: string[]): LoginIssue[] {
  return commonLoginIssues.filter((issue) =>
    symptoms.some((symptom) => issue.problem.toLowerCase().includes(symptom.toLowerCase())),
  )
}
