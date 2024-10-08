import { Buffer } from "buffer";
import process from "process";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
  window.process = process;
}

export { generateWallet } from "urbit-key-generation";

export function initializeLoginForm() {
  document.addEventListener("DOMContentLoaded", () => {
    // TODO: actually select correct form
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const urbitId = document.getElementById("urbitId").value;
      const masterTicket = document.getElementById("masterTicket").value;
      const challenge = loginForm.dataset.challenge;

      if (!urbitId || !masterTicket) {
        alert("Please enter both Urbit ID and Master Ticket");
        return;
      }

      try {
        // Generate the wallet using urbit-key-generation
        const wallet = await generateWallet(masterTicket, urbitId);

        // Sign the challenge using the wallet's private key
        const signedChallenge = await wallet.sign(challenge);

        // Submit the login request
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            urbitId,
            signedChallenge,
          }),
        });

        const result = await response.json();

        if (result.success) {
          // Redirect to home page or update UI to show logged in state
          window.location.href = "/";
        } else {
          alert("Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login. Please try again.");
      }
    });
  });
}
