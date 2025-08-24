import ChatApp from '@components/chat-app/chat-app'
import { ThemeProvider } from '@theme/theme-provider/theme-provider'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <ChatApp />
      </div>
    </ThemeProvider>
  )
}

export default App
