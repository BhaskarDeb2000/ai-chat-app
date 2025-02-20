
# AI Chat Application

This is a React-based chat app that connects to an AI model to handle real-time conversations. The application includes features such as theme toggling, dynamic message rendering, and an interactive chat experience. It’s deployed on Vercel for seamless access.

## 🚀 Features

- **Real-time AI Chat**: Interact with an AI that responds instantly to your messages.
- **Dark/Light Mode Toggle**: Switch between dark and light themes for a personalized experience.
- **AI Model Choices**: Choose between different AI models for varied responses.
- **Markdown Support**: Send and display messages with rich formatting.
- **Error Handling**: Clear and concise error messages for better UX.
- **Responsive UI**: Designed to work well across all device sizes.

## 🛠 Tech Stack

- **React** – For building the user interface and managing the app’s state.
- **React Icons** – For beautiful, easy-to-use icons throughout the app.
- **React Markdown** – To render markdown-formatted text within chat messages.
- **clsx** – To conditionally apply classes for dark/light mode and other dynamic styles.
- **Tailwind CSS** – Utility-first CSS for fast and flexible styling.
- **Vercel** – For hosting and deploying the application with zero-config setup.

## 🌍 Deployed on Vercel

You can check out the live version of the app here:  
[Live App URL](https://ai-chat-app-dusky.vercel.app/)

## ⚙️ Setup and Installation

To get the app running locally, follow these steps:

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/ai-chat-app.git
   cd ai-chat-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a .env file at the root and include your [DeepSeek API credentials](https://api-docs.deepseek.com/):

   ```env
   VITE_DEFAULT_API_KEY=your-api-key
   VITE_DEFAULT_API_URL=your-api-url
   ```

4. **Run the app locally:**

   ```bash
   npm run dev
   ```

5. Open the app at [http://localhost:5173/](http://localhost:5173/).
